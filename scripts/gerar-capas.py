# Gera as capas do blog a partir das fotos de public/hero/.
# Cada artigo tem um enquadramento proprio: sem rosto e sem roupa de frio,
# so o assunto. Depois aplica o tratamento navy do site (a luminancia e
# nivelada pela faixa-obra, para as capas formarem um conjunto so).
#
# Para um artigo novo: acrescente o slug em MAPA e rode  python3 scripts/gerar-capas.py
# Precisa de Pillow e numpy.

from PIL import Image, ImageEnhance, ImageFilter
import numpy as np, os, sys

# tema -> foto + enquadramento. Nenhum rosto, nenhuma roupa de frio: so o assunto.
MAPA = {
 'o-que-e-seguro-garantia':                 ('handshake',    {'foco':0.40}),
 'garantia-de-proposta-lei-14133':          ('blueprint',    {'foco':0.42}),
 'garantia-adicional-lei-14133':            ('calc',         {'foco':0.10}),
 'garantia-de-execucao-contrato-lei-14133': ('construction', {'box':(0.00,0.30,0.55,0.92),'foco':0.50}),
 'seguro-garantia-contratos-privados':      ('cleaner',      {'foco':0.34}),
 'seguro-garantia-judicial':                ('justice',      {'foco':0.42}),
 'seguro-garantia-judicial-trabalhista':    ('justice',      {'foco':0.72}),
 'seguro-garantia-deposito-recursal':       ('bridge',       {'foco':0.32}),
 'seguro-garantia-negado-limite-de-credito':('office',       {'box':(0.42,0.08,1.00,0.70),'foco':0.50}),
 'seguro-garantia-vs-caucao-fianca':        ('calc',         {'foco':0.62}),
}
NAVY  = np.array([18, 40, 63], dtype=np.float32)
PESOS = np.array([.299, .587, .114], dtype=np.float32)
W, H  = 1000, 563
ALVO  = float((np.asarray(Image.open('public/faixa-obra.webp').convert('RGB'), np.float32) @ PESOS).mean())

def enquadra(im, cfg, alvo=16/9):
    if 'box' in cfg:
        a,b,c,d = cfg['box']; w,h = im.size
        im = im.crop((int(a*w), int(b*h), int(c*w), int(d*h)))
    foco = cfg.get('foco', 0.40)
    w, h = im.size
    if w/h > alvo:
        nw = int(h*alvo); return im.crop(((w-nw)//2, 0, (w-nw)//2+nw, h))
    nh = int(w/alvo); t = int((h-nh)*foco)
    return im.crop((0, t, w, t+nh))

def trata(im, upscale):
    if upscale > 1.15:
        im = im.filter(ImageFilter.UnsharpMask(radius=1.1, percent=85, threshold=3))
    im = ImageEnhance.Color(im).enhance(0.60)
    im = ImageEnhance.Contrast(im).enhance(1.05)
    a = np.asarray(im, dtype=np.float32)
    a = np.clip(a * np.clip(ALVO/float((a @ PESOS).mean()), 0.55, 1.25), 0, 255)
    lum = np.clip((a @ PESOS)[:, :, None], 0.0, 255.0)
    k = np.clip(0.12 + np.power((255.0-lum)/255.0, 1.15)*0.50, 0, 0.62)
    a = a*(1-k) + NAVY*k
    assert np.isfinite(a).all()
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))

if __name__ == '__main__':
    os.makedirs('public/blog/capas', exist_ok=True)
    total = 0
    for slug, (foto, cfg) in MAPA.items():
        im = enquadra(Image.open(f'public/hero/hero-{foto}.webp').convert('RGB'), cfg)
        up = W/im.width
        out = trata(im.resize((W, H), Image.LANCZOS), up)
        out.save(f'public/blog/capas/{slug}.webp', 'WEBP', quality=80, method=6)
        out.resize((760, 428), Image.LANCZOS).save(f'public/blog/capas/{slug}-card.webp', 'WEBP', quality=73, method=6)
        total += os.path.getsize(f'public/blog/capas/{slug}-card.webp')
        print(f'{slug:42s} {foto:13s} nativo {im.width:4d}px  upscale {up:.2f}x')
    print(f'\nlistagem: {total//1024}KB')
