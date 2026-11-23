# Turquoise Home Studio — concept v3 (Nomad Web Studio)

Subject inventory: Кинг Тауэр 147-р байр (ХУД 17-р хороо, Кинг спорт комплексийн урд) · логоны дүүжин гэрэл · өөрсдийн 2 bone china коллекц: **Royal Ware** (Монгол гэрийн тооны дүрслэл, гал улаан, 20ш · 1,468,000→1,321,000₮) ба **Celeste** (цэлмэг тэнгэрийн цэнхэр + платинум хүрээ, 17ш · 1,149,000₮) · "аяга тавгийг дээш харсан сав гэж бэлгэддэг" ёс · Туркийн Madame Coco · Тенсел + Tussah silk хөнжил · Mulberry silk 22mm · 100% хөвөн алчуур · Storepay, хүргэлт · 10:00–19:00 · 9900-7901.

Idea: **тавагны амсар бол хүрээ.** Сайтын бүх зураг тавагны амсартай дугуй хүрээнд (цагаан амсар + алтан зураас + дотор сүүдэр), брэнд нь хоёр коллекцоороо (Royal Ware ↔ Celeste) бүх өнгө, бичгийг удирдана.

Copy rule: зөвхөн захиалагчийн FB/IG дээр бичсэн уриа, тайлбар (Modern décor • Cozy living • Timeless style · Минимал дизайн, дулаан уур амьсгал, тайван мэдрэмж · Timeless Elegance, Crafted for Your Table · Sleep in Luxury · #Skinfriendly …). Зохиомол уриа бичихгүй.

Live thing: **Ширээ засагч** — коллекц + зочдын тоо → дээрээс харсан ширээ, сет, нийт үнэ, сагс.

## Tokens
- --ivory #F5F0E8 · --ink #14211F · --turq #00C2BE · --deep #0A5A5D · --gold #C2A15A
- Royal: --royal #C21F2A, суурь --royal-bg #F3DDD6 · Celeste: суурь --cel-bg #DCE9F2
- Өрөөнүүдийн суурь: Tableware #00C2BE · Sleep #F2DCD4 · Cotton #D5E5EE · Madame Coco #E9DDC7

## Type
- Display: **Cormorant Garamond** 300/400/500 + italic (гарчиг, үнэ)
- Script: **Pinyon Script** (зөвхөн латин: Royal Ware, Celeste, Tableware, Sleep in Luxury…)
- Body/UI: **Commissioner** 300–600; жижиг label 12px uppercase .13–.24em
- Ү Ө ₮ шалгасан, self-host (fonts/, unicode-range subset)

## Layout
- Hero: нэг static камертай бичлэг, гарчиг зүүн дээд буланд (цэцэг, лааг дарахгүй)
- Коллекц: бүтэн дэлгэц, хулгана зүүн тал = Royal Ware, баруун = Celeste (суурь өнгө, том script үг, таваг, текст, үнэ бүгд солигдоно); утсан дээр 5.2с тутам эсвэл swipe
- Өрөөнүүд: өнгөт картууд sticky-гээр бие биен дээгүүр гулсана (дэлгэцээс өндөр өрөө доод хэсгээ харуулсны дараа наалдана)
- Шинэ ирэлт: дугуй тавагтай картууд, desktop дээр pin хийгдсэн хэвтээ гүйлгээ, тавган дээр луп
- Radius: зураг = тойрог (тавагны амсар), товч 999px, өрөөний карт 28px

## Motion (GSAP 3.12.5 + ScrollTrigger + Lenis 1.1.13, js/ дотор self-host)
- Intro: логоны гэрэл асна (sessionStorage-оор нэг удаа)
- Hero: hero-bloom.mp4 (10с) нэг удаа тоглоно — ард цэцэг ургаж дэлгэрээд, ширээн дээрх лаа асна; дуусахад hero-loop.mp4 (дэлгэрсэн, лаа асаалттай) crossfade-ээр тасралтгүй давтагдана
- Гарчиг mask-аас дээш, коллекцын таваг эргэлдэж орж ирнэ, statement үг үгээр тодорно, өрөөний зураг/объект эргэлдэж орно
- Луп: тавган дээр хулгана аваачихад 2.3× томруулсан дугуй шил
- prefers-reduced-motion эсвэл GSAP ачаалагдахгүй бол бүх агуулга статик

## Images
- Захиалагчийн FB/IG бодит зураг. flutes (үнийн бичиг), mirror-gold (үйлдвэрийн тамга) дээрх бичгийг арилгасан; текст наалттай зургийг ашиглахгүй
- Hero v3: Higgsfield flux edit (нахиа, асаагүй лаа) → kling3_0 start/end frame, камер хөдөлгөөнгүй. Desktop 1920×1270, утас 720×1280 (лаа багтаасан crop)
- Cutout (c-*.webp): Higgsfield gpt_image transparent, захиалагчийн бүтээгдэхүүний зурагнаас
- Байршлын бичлэг: IG-ийн хамгийн сүүлийн reel (DcG8FFgoMcb)
- Лого: захиалагчийн cover зурагнаас SVG болгосон
