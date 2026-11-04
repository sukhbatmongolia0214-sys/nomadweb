# Od Print — concept (Nomad Web Studio)
Idea: хэвлэлийн хуудасны **тайралтын тэмдэг (crop marks) ба CMYK өнгөний шалгах зурвас** нь хүрээ, навигаци болно; ERP-ээр захиалгын явцыг шалгах нь гол live thing.
Logo: захиалагчийн лого — 2 нуман зураас + crosshair + CMYK 4 цэг (inline SVG mark) + wordmark PNG (img/logo-word.png, footer-т img/logo-word-w.png).
Color: --paper #f6f6f2 · --ink #0f1412 · --green #179151 (логоны ногоон) · --gdark #0f6e3d · --line rgba(15,20,18,.14) · CMYK (#00aeef #ec008c #ffe600 #111) зөвхөн тэмдэг, зурвас, үйлчилгээний tint-д
Type: Manrope 500–800 (display/body, tracking -0.03em) · JetBrains Mono 500–700 (спец, хэмжээ, тэмдэглэгээ)
Spacing: 8px step; section gap 140px desktop / 88px mobile; margin clamp(16px,4vw,56px)
Radius: 4px (хэвлэмэл материалын бага дугуйрал); товч 999px биш, 4px
Motion:
- Intro loader (#ld): логоны нум зурагдана → crosshair эргэж орно → CMYK цэг дараалан → wordmark clip reveal → дэлгэц дээш гулсаж гарна (~2.3s). sessionStorage-оор нэг удаа; reduced-motion / no-js үед гарахгүй.
- Hero: h1 үг бүр 80ms зайтай доороос; видео loop.
- Үйлчилгээ (#sl): том жагсаалт; desktop дээр зураг курсорыг lerp-ээр дагаж pop-out (scale .55→1 spring, хурдаар хазайна), хэсгийн дэвсгэр тухайн мөрийн CMYK tint болно; scroll хийхэд ч идэвхтэй мөр солигдоно. Утсанд inline thumb + IntersectionObserver.
- Тоо count-up, зураг clip-path reveal, явцын шугам дүүрэх. Зөвхөн transform/opacity/clip-path.
Images: Higgsfield gpt_image_2_5 remix (1024px). Текст нь буруу гарсан remix-ийг хасаж эх зургийг үлдээсэн (table-org, notebook-white).
