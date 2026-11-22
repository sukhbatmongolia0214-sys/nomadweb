# Turquoise Home Studio — concept (Nomad Web Studio)

Subject inventory: Кинг Тауэр 147-р байр (ХУД 17-р хороо, Кинг спорт комплексийн урд) · гэрэлтдэг "Turquoise" бичигтэй, turquoise арын гэрэлтэй тавиурын нүднүүд · логоны дүүжин гэрэл (нум + бүрхүүл "i" үсгийн дээр) · өөрсдийн 2 bone china коллекц: **Royal Ware** (Монгол гэрийн тооны дүрслэл, гал улаан, 20ш · 1,468,000→1,321,000₮) ба **Celeste** (цэлмэг тэнгэрийн цэнхэр + платинум хүрээ, 17ш · 1,149,000₮) · "аяга тавгийг дээш харсан сав гэж бэлгэддэг" ёс · Туркийн Madame Coco / Karaca · Тенсел + Tussah silk хөнжил 419,000₮ · Mulberry silk 22mm · 100% хөвөн алчуур · Storepay, хүргэлт · 10:00–19:00 · 9900-7901.

Idea: **тооноос харсан тэнгэр** — Royal Ware-ийн тооно хээ, Celeste-ийн тэнгэр — нь **дугуй хүрээ (тавагны амсар)** болно. Гол дүрсүүд тавагны амсар шиг тойрогоор хүрээлэгдэж, хээтэй амсар нь гүйлгэхэд тооно шиг аажим эргэнэ. Материалын дээж, ширээ засагч, footer-ийн тойрог бүгд энэ хэлбэрээс.

Live thing: **Ширээ засагч** — коллекц (Royal Ware / Celeste) + зочдын тоо (2–12) → дээрээс харсан ширээн дээр тавагнууд тойрог хэлбэрээр байрлана, хэдэн сет, хэдэн ширхэг, нийт үнэ гарч, сагсанд нэмнэ.

Signature motion: intro дээр логоны **гэрэл асна** (нум зурагдана → бүрхүүл → дулаан гэрлийн туяа "Turquoise" дээр тусна → дэлгэц дээш гулсана, ~2.2с, sessionStorage-оор нэг удаа).

## Tokens
- --paper #F3EFE6 (cover-ийн зааны ясан суурь) · --paper2 #EAE4D8 · --ink #0F2524 · --mute rgba(15,37,36,.68)
- --turq #00C2BE (брэндийн аква: том дүүргэлт, тойрог) · --teal #0A6466 (товч, линк — paper дээр AA) · --sky #0E8CAB (Celeste-ийн хананы цэнхэр) · --royal #C8202A (Royal Ware улаан, хямдрал)
- --line rgba(15,37,36,.14)

## Type
- Display: **Noto Serif Display** 300/400 (гарчиг, үнэ том), tracking -0.02em, leading 1.0
- Body/UI: **Commissioner** 400/500/600, 16–18px, leading 1.55; үнэ tabular-nums
- Ү Ө ₮ шалгасан (fontTools). Фонт self-host (fonts/, unicode-range 4 subset)

## Layout
- Grid 12 col, max 1320px, margin clamp(18px,4vw,56px); section gap 160px desktop / 96px mobile
- Radius: зураг 0 (editorial), товч ба chip 999px (тойргийн санаа), материалын дээж = тойрог
- Хөрш section өөр composition: hero full-bleed видео → 2 багана коллекц + голд таваг → ширээ засагч (зүүн control, баруун SVG ширээ) → каталог grid → хэвтээ тойрог дээжүүд → том зураг + бэлгийн жагсаалт → дэлгүүр (өндөр зураг + мэдээлэл) → footer том лого

## Motion
- Section хэсгүүд 70ms зайтай, 24px дээш (IntersectionObserver); зөвхөн transform/opacity
- Тавагны амсар scroll-оор эргэнэ (rotate), ширээ засагчид тавагнууд scale-оор орж ирнэ
- prefers-reduced-motion / no-JS үед бүх агуулга шууд харагдана

## Images
- Захиалагчийн FB/IG бодит зураг (Downloads\Turquoise, 60 ш), текст давхарлагатайг нь тайрсан
- Hero видео: Higgsfield kling3_0 pro 10s, tq_001.jpg-ээс (start=end → тасралтгүй давталт)
- Лого: cover зурагнаас potrace-аар SVG болгосон (захиалагчийн жинхэнэ лого, шинээр зураагүй)
