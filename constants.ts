/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// FIX: Removed unused 'SettingsIcon' import as it's not exported from components.
import {
    IdPhotoIcon,
    RestorationIcon,
    SymmetryIcon,
    LightingIcon,
    BackgroundIcon,
    CleanBackgroundIcon,
    MockupIcon,
    TrendIcon,
    ImageFilterIcon,
    WeddingIcon,
    BirthdayIcon,
    SharpenIcon,
    FamilyIcon,
    PaletteIcon,
    ColorCorrectionIcon,
    FaceAlignIcon,
    FaceTransformIcon,
    WrinkleIcon,
    HistoryIcon,
    DocumentIcon,
    FashionIcon,
    ClothingIcon,
} from './components';

export const TABS = [
    { id: 'id-photo', label: 'Chỉnh Sửa Ảnh Thẻ', icon: IdPhotoIcon, description: 'Tạo và tùy chỉnh ảnh thẻ chuyên nghiệp chỉ với một cú nhấp chuột.', guideText: 'Hướng dẫn làm ảnh thẻ', guideLink: 'https://www.youtube.com/watch?v=LoqkFbNIzj4&list=PL6ftEPuxjU4YGs5uk56t6ZjG95Ox6XyYV' },
    { id: 'restoration', label: 'Phục Chế Ảnh Cũ', icon: RestorationIcon, description: 'Khôi phục, sửa chữa và làm mới những bức ảnh cũ, bị hỏng hoặc mờ.', guideText: 'Hướng dẫn phục chế ảnh cũ', guideLink: 'https://www.youtube.com/watch?v=jx1XhzF8sdo&feature=youtu.be' },
    { id: 'document-restoration', label: 'Phục Hồi Giấy Tờ Cũ', icon: DocumentIcon, description: 'Khôi phục các loại giấy tờ, tài liệu cũ bị ố, rách hoặc mờ chữ.', guideText: 'Hướng dẫn phục hồi giấy tờ cũ', guideLink: '#' },
    { id: 'fashion-design', label: 'Thiết Kế Thời Trang', icon: FashionIcon, description: 'Sử dụng AI để thử trang phục lên người mẫu và thiết kế các ý tưởng thời trang độc đáo.', guideText: 'Hướng dẫn thiết kế thời trang', guideLink: '#' },
    { id: 'clothing-change', label: 'Thay Đổi Trang Phục', icon: ClothingIcon, description: 'Thay đổi quần áo của người trong ảnh bằng mô tả hoặc ảnh mẫu.', guideText: 'Hướng dẫn thay đổi trang phục', guideLink: '#' },
    { id: 'face-transform', label: 'AI Hoán Đổi Gương Mặt', icon: FaceTransformIcon, description: 'Tạo ra những hình ảnh mới tuyệt đẹp bằng cách kết hợp khuôn mặt của bạn với các ý tưởng sáng tạo.', guideText: 'Hướng dẫn hoán đổi gương mặt', guideLink: '#' },
    { id: 'wrinkle-editor', label: 'Chỉnh sửa nếp nhăn AI', icon: WrinkleIcon, description: 'Tải ảnh lên và để AI làm mờ nếp nhăn trên mặt hoặc quần áo.', guideText: 'Hướng dẫn chỉnh sửa nếp nhăn', guideLink: '#' },
    { id: 'image-filter', label: 'Bộ Lọc Hình Ảnh', icon: ImageFilterIcon, description: 'Áp dụng nhiều bộ lọc và hiệu ứng nâng cao để cải thiện ảnh của bạn.', guideText: 'Hướng dẫn sử dụng bộ lọc hình ảnh', guideLink: '#' },
    { id: 'wedding-photo', label: 'Ảnh Cưới AI', icon: WeddingIcon, description: 'Tạo album ảnh cưới trong mơ của bạn với nhiều concept độc đáo.', guideText: 'Hướng dẫn làm ảnh cưới AI', guideLink: '#' },
    { id: 'birthday-photo', label: 'Tạo Ảnh Sinh Nhật', icon: BirthdayIcon, description: 'Tạo những bức ảnh sinh nhật độc đáo với các concept sáng tạo.', guideText: 'Hướng dẫn tạo ảnh sinh nhật', guideLink: '#' },
    { id: 'upscaler', label: 'Làm Nét Ảnh', icon: SharpenIcon, description: 'Nâng cấp ảnh của bạn lên độ phân giải 4K hoặc 8K siêu nét và chi tiết.', guideText: 'Hướng dẫn làm nét ảnh', guideLink: '#' },
    { id: 'family-face-swap', label: 'Ghép Mặt Ảnh Gia Đình', icon: FamilyIcon, description: 'Thay thế khuôn mặt trong ảnh nhóm bằng ảnh chân dung bạn cung cấp.', guideText: 'Hướng dẫn ghép mặt ảnh gia đình', guideLink: '#' },
    { id: 'preset-color', label: 'Màu Preset', icon: PaletteIcon, description: 'Biến đổi ảnh của bạn với các phong cách màu được hỗ trợ bởi AI.', guideText: 'Hướng dẫn sử dụng màu preset', guideLink: '#' },
    { id: 'color-correction', label: 'Căn Chỉnh Màu Sắc', icon: ColorCorrectionIcon, description: 'Tinh chỉnh độ sáng, tương phản, độ bão hòa và các yếu tố màu sắc khác.', guideText: 'Hướng dẫn căn chỉnh màu sắc', guideLink: '#' },
    { id: 'face-align', label: 'Căn Chỉnh Thẳng Mặt', icon: FaceAlignIcon, description: 'Tự động xoay và căn chỉnh khuôn mặt để nhìn thẳng một cách chuyên nghiệp.', guideText: 'Hướng dẫn căn chỉnh thẳng mặt', guideLink: '#' },
    { id: 'symmetry', label: 'Chỉnh Sửa Cân đối', icon: SymmetryIcon, description: 'Tinh chỉnh và cân bằng các đường nét trên khuôn mặt một cách tự nhiên.', guideText: 'Hướng dẫn chỉnh sửa cân đối', guideLink: '#' },
    { id: 'lighting', label: 'Ánh Sáng', icon: LightingIcon, description: 'Tái tạo và thay đổi ánh sáng của ảnh với các hiệu ứng chuyên nghiệp.', guideText: 'Hướng dẫn chỉnh ánh sáng', guideLink: '#' },
    { id: 'background', label: 'Thay Nền', icon: BackgroundIcon, description: 'Dễ dàng tách và thay đổi nền ảnh bằng văn bản hoặc ảnh tham chiếu.', guideText: 'Hướng dẫn thay nền', guideLink: '#' },
    { id: 'clean-background', label: 'Làm Sạch Nền', icon: CleanBackgroundIcon, description: 'Công cụ chuyên nghiệp để tẩy chi tiết thừa, cân bằng màu sắc và làm mịn phông nền mà không ảnh hưởng đến chủ thể.', guideText: 'Hướng dẫn làm sạch nền', guideLink: '#' },
    { id: 'trend-creator', label: 'Tạo ảnh Trend', icon: TrendIcon, description: 'Sử dụng ảnh của bạn và một trend có sẵn để tạo ra một tác phẩm độc đáo.', guideText: 'Hướng dẫn tạo ảnh trend', guideLink: '#' },
    { id: 'mockup', label: 'Tạo Mockup', icon: MockupIcon, description: 'Tạo mockup sản phẩm chuyên nghiệp với nhân vật và bối cảnh tùy chỉnh.', guideText: 'Hướng dẫn tạo mockup', guideLink: '#' },
    { id: 'history', label: 'Lịch sử', icon: HistoryIcon, description: 'Xem lại, tải xuống hoặc xóa các ảnh bạn đã tạo trước đây.', guideText: 'Hướng dẫn xem lịch sử', guideLink: '#' },
];

export const WEDDING_CONCEPTS = [
      { id: 'beach', label: 'Bãi biển', recommended: true, prompt: 'A romantic wedding photoshoot on a beautiful beach at sunset, with white sand and blue ocean.' },
      { id: 'classic', label: 'Cổ điển', recommended: false, prompt: 'A classic and elegant indoor wedding photo, in a grand hall with chandeliers and flowers.' },
      { id: 'city', label: 'Thành phố', recommended: false, prompt: 'A modern wedding photoshoot in a bustling city street, with skyscrapers and city lights in the background.' },
      { id: 'hanbok', label: 'Hanbok truyền thống', recommended: false, prompt: 'A traditional Korean wedding photoshoot with the couple wearing beautiful Hanbok in a historical palace.' },
      { id: 'forest', label: 'Rừng cây', recommended: true, prompt: 'A whimsical wedding photoshoot in an enchanted forest, surrounded by tall trees and magical sunlight.' },
      { id: 'chinese_attire', label: 'Trang phục Trung Quốc', recommended: true, prompt: 'A traditional Chinese wedding photoshoot, with the couple in red and gold outfits, in a classic Chinese garden setting.' },
      { id: 'seoul_rooftop', label: 'Sân thượng Seoul', recommended: false, prompt: 'A trendy wedding photoshoot on a rooftop in Seoul, overlooking the city skyline at dusk.' },
      { id: 'jeju_island', label: 'Đảo Jeju', recommended: false, prompt: 'A beautiful wedding photoshoot on Jeju Island, with scenic fields of flowers or coastal views.' },
      { id: 'gyeongbok_palace', label: 'Cung điện Gyeongbok', recommended: false, prompt: 'An elegant wedding photoshoot at Gyeongbok Palace in Seoul, showcasing historical Korean architecture.' },
      { id: 'k_drama', label: 'Phong cách K-Drama', recommended: false, prompt: 'A dramatic and romantic K-Drama style wedding photo, capturing a poignant moment between the couple.' },
      { id: 'royal', label: 'Hoàng gia', recommended: false, prompt: 'A royal-themed wedding photoshoot, with the couple dressed as a prince and princess in a luxurious castle.' },
      { id: 'rustic', label: 'Mộc mạc', recommended: true, prompt: 'A rustic-themed wedding photoshoot in a countryside barn or field, with simple, natural decorations.' },
      { id: 'minimalist_studio', label: 'Studio tối giản', recommended: false, prompt: 'A minimalist studio wedding photoshoot with a clean, simple background, focusing entirely on the couple.' },
      { id: 'neon_city', label: 'Thành phố Neon', recommended: false, prompt: 'A vibrant wedding photoshoot in a city at night, illuminated by colorful neon signs.' },
      { id: 'magazine_style', label: 'Phong cách tạp chí', recommended: false, prompt: 'A high-fashion, magazine-style wedding photoshoot with editorial poses and dramatic lighting.' },
];

export const BIRTHDAY_CONCEPTS = [
    { id: 'elegant_gown', label: 'Váy Dạ Hội Thanh Lịch', prompt: 'A stunning birthday photoshoot, subject wearing an elegant evening gown in a luxurious setting.' },
    { id: 'bohemian_muse', label: 'Nàng Thơ Bohemian', prompt: 'A whimsical birthday photoshoot, subject as a bohemian muse with flowing clothes in a natural, rustic environment.' },
    { id: 'modern_queen', label: 'Nữ Hoàng Hiện Đại', prompt: 'A powerful and modern birthday photoshoot, subject portrayed as a modern queen with stylish, regal attire.' },
    { id: 'princess_balloons', label: 'Công chúa & Bóng Bay', prompt: 'A fairy-tale birthday photoshoot, subject dressed as a princess surrounded by colorful balloons.' },
    { id: 'muse_pink_balloons', label: 'Nàng Thơ & Bóng Bay Hồng', prompt: 'A dreamy birthday photoshoot, subject as a muse surrounded by aesthetic pink balloons.' },
    { id: 'lady_in_red', label: 'Quý Cô Đỏ Quyến Rũ', prompt: 'A glamorous birthday photoshoot, subject in a captivating red dress, exuding confidence and charm.' },
    { id: 'luxurious_black_dress', label: 'Đầm Đen Sang Trọng', prompt: 'An elegant birthday photoshoot, subject wearing a luxurious black dress at a classy evening event.' },
    { id: 'classic_beauty', label: 'Vẻ Đẹp Cổ Điển', prompt: 'A timeless birthday photoshoot capturing classic beauty, with vintage-inspired fashion and setting.' },
    { id: 'party_queen', label: 'Nữ Hoàng Đêm Tiệc', prompt: 'A vibrant birthday photoshoot, subject as the queen of the party, with festive lights and a celebratory atmosphere.' },
    { id: 'stage_lights', label: 'Ánh Đèn Sân Khấu', prompt: 'A dramatic birthday photoshoot, subject on a stage under bright spotlights, looking like a star.' },
    { id: 'sweet_candy_dream', label: 'Giấc Mơ Kẹo Ngọt', prompt: 'A playful and sweet birthday photoshoot in a candy-land-themed environment with pastel colors.' },
    { id: 'fashion_coffee', label: 'Thời Trang & Cà Phê', prompt: 'A chic birthday photoshoot in a stylish coffee shop, with a high-fashion aesthetic.' },
    { id: 'rococo_tea_party', label: 'Tiệc Trà Rococo', prompt: 'An ornate Rococo-style tea party birthday photoshoot, with elaborate dresses and decorations.' },
    { id: 'modern_fairy_tale', label: 'Cổ Tích Hiện Đại', prompt: 'A modern fairy-tale birthday photoshoot, blending classic fantasy elements with a contemporary twist.' },
    { id: 'dreamy_mint', label: 'Xanh Bạc Hà Mộng Mơ', prompt: 'A dreamy birthday photoshoot with a mint green color palette, creating a fresh and ethereal vibe.' },
];

export const GENDER_OPTIONS = [
    { id: 'nu', label: 'Nữ' },
    { id: 'nam', label: 'Nam' }
];

export const AGE_GROUP_OPTIONS = [
    { id: 'nguoi-lon', label: 'Người lớn' },
    { id: 'thanh-nien', label: 'Thanh niên' },
    { id: 'tre-em', label: 'Trẻ em' }
];

export const CLOTHING_OPTIONS = [
    { id: 'giu-nguyen', label: 'Giữ nguyên', prompt: '' },
    { id: 'ao-so-mi', label: 'Áo Sơ mi', prompt: 'a formal collared dress shirt' },
    { id: 'ao-so-mi-trang', label: 'Áo Sơ mi Trắng', prompt: 'a formal white collared dress shirt' },
    { id: 'ao-polo', label: 'Áo Polo', prompt: 'a simple polo shirt' },
    { id: 'ao-kieu', label: 'Áo kiểu', prompt: 'a stylish blouse' },
    { id: 'ao-phong-tron', label: 'Áo phông trơn', prompt: 'a plain t-shirt' },
    { id: 'ao-vest', label: 'Áo Vest', prompt: 'a formal business suit with a tie' },
    { id: 'cong-so', label: 'Công sở', prompt: 'professional office attire' },
    { id: 'vest-nu-cong-so-2', label: 'Vest nữ công sở 2', prompt: 'a modern women\'s office blazer over a simple top' },
    { id: 'ao-trang-khan-quang', label: 'Áo trắng & Khăn quàng', prompt: 'a white shirt with a pioneer scarf' },
    { id: 'ao-dai-trang', label: 'Áo dài trắng', prompt: 'a traditional white Vietnamese Ao Dai' },
    { id: 'nu-sinh-hq-1', label: 'Nữ Sinh HQ 1', prompt: 'a Korean high school uniform, style 1' },
    { id: 'nu-sinh-hq-2', label: 'Nữ Sinh HQ 2', prompt: 'a Korean high school uniform, style 2' },
    { id: 'nu-sinh-hq-3', label: 'Nữ Sinh HQ 3', prompt: 'a Korean high school uniform, style 3' }
];

export const HAIR_STYLE_OPTIONS = [
    { id: 'giu-nguyen', label: 'Giữ nguyên', prompt: '' },
    { id: 'gon-gang', label: 'Gọn gàng', prompt: 'a neat and tidy hairstyle' },
    { id: 'toc-ngan', label: 'Tóc ngắn', prompt: 'a short hairstyle' },
    { id: 'toc-dai', label: 'Tóc dài', prompt: 'a long hairstyle' },
    { id: 'toc-dai-bong-benh', label: 'Tóc dài Bồng bềnh', prompt: 'long, voluminous hair' },
    { id: 'thoi-trang', label: 'Thời trang', prompt: 'a trendy, modern hairstyle' },
    { id: 'toc-buoc-gon', label: 'Tóc buộc gọn', prompt: 'hair neatly tied back' },
    { id: 'texture-crop-nam', label: 'Texture Crop NAM', prompt: 'a male textured crop hairstyle' },
    { id: 're-doi-hq-nam', label: 'Rẽ đôi HQ Nam', prompt: 'a Korean-style middle part hairstyle for men' },
    { id: 'xoan-ngan-nam', label: 'Xoăn Ngắn Nam', prompt: 'a short, curly hairstyle for men' },
    { id: 'hat-de-ngo-nam', label: 'Hạt Dẻ Ngô Nam', prompt: 'a chestnut-style haircut for men' }
];

export const BACKGROUND_COLOR_OPTIONS = [
    { id: 'xanh', label: 'Xanh' },
    { id: 'trang', label: 'Trắng' },
    { id: 'xam', label: 'Xám' },
    { id: 'xanh-dam', label: 'Xanh Đậm' },
];

export const LIGHTING_STYLES = [ 
  { 
    name: "Ánh sáng bên", 
    prompt: "Apply natural side lighting: light coming from one side, like sunlight through a window, illuminating half of the face clearly while the other half remains softly shaded. Keep the transition smooth and realistic." 
  },
  { 
    name: "Ánh sáng cứng", 
    prompt: "Apply natural hard light: direct sunlight effect with sharp, well-defined shadows and strong contrast. The look should feel realistic, like midday sun, without artificial glow." 
  },
  { 
    name: "Ánh sáng 45°", 
    prompt: "Apply natural 45-degree lighting: light angled from above and to the side, forming a small triangle of light on the shadowed cheek. Shadows should stay gentle and natural, adding depth without harshness." 
  },
  { 
    name: "Ánh sáng ngược", 
    prompt: "Apply natural backlighting: strong light from behind the subject, creating a soft rim or halo glow around the hair and shoulders. Keep the front lighting subtle and balanced." 
  },
  { 
    name: "Ánh sáng nền", 
    prompt: "Apply natural background lighting: light behind the subject that softly brightens the backdrop, separating the subject from it. The front should remain evenly and naturally lit." 
  },
  { 
    name: "Ánh sáng tóc", 
    prompt: "Apply natural hair lighting: gentle light from above or behind that highlights the hair. Keep it subtle and realistic, adding texture and depth without overexposing." 
  },
  { 
    name: "Ánh sáng tách đôi", 
    prompt: "Apply natural split lighting: light shining from one side, dividing the face into a bright half and a shadowed half. The contrast should look natural and not overly dramatic." 
  },
  { 
    name: "Ngược sáng toàn phần", 
    prompt: "Apply natural silhouette effect: strong light from behind, turning the subject into a dark outline against a bright background. Preserve clean edges and a natural atmosphere." 
  },
  { 
    name: "Ánh sáng môi trường", 
    prompt: "Apply natural ambient lighting: soft, diffused light filling the scene, like daylight on a cloudy day. Minimal shadows, evenly lit subject, and a gentle, realistic look." 
  },
];

export const COLOR_PRESETS = [
  { id: 'old-film', name: 'Phim Cũ', prompt: 'Apply a vintage film color grade. Introduce warm tones, slightly faded blacks, and a subtle grain to emulate the look of classic analog film photography.' },
  { id: 'cyberpunk', name: 'Neon Cyberpunk', prompt: 'Apply a neon cyberpunk color grade. Emphasize blues, purples, and pinks in the highlights and shadows. Create a futuristic, high-contrast, neon-lit nighttime aesthetic.' },
  { id: 'golden-hour', name: 'Ảnh Vàng Giờ Vàng', prompt: 'Apply a warm, golden hour color grade. Enhance the yellows, oranges, and reds to simulate the soft, warm light of sunset or sunrise. Create a dreamy and romantic atmosphere.' },
  { id: 'noir', name: 'Đen Trắng Noir', prompt: 'Convert the image to black and white with a high-contrast, noir aesthetic. Deepen the blacks, brighten the whites, and create a dramatic, moody, and cinematic look.' },
  { id: 'vivid-dream', name: 'Mộng Ảo Sống Động', prompt: 'Apply a vivid and dreamlike color grade. Increase saturation and vibrance, shift colors towards surreal tones like teal and orange, and add a soft, ethereal glow.' },
  { id: 'faded-summer', name: 'Hè Phai Màu', prompt: 'Apply a faded summer color grade. Desaturate the colors slightly, lift the black point for a matte look, and add a warm, hazy, sun-drenched feel.' },
  { id: 'deep-forest', name: 'Rừng Sâu Lặng', prompt: 'Apply a deep forest color grade. Emphasize rich greens and earthy browns. Cool down the shadows and create a moody, quiet, and atmospheric look reminiscent of a dense forest.' },
  { id: 'deep-sea', name: 'Biển Xanh Thẳm', prompt: 'Apply a deep blue sea color grade. Emphasize deep blues, teals, and cyans. Cool the overall temperature and create a mysterious, underwater, or oceanic feeling.' },
  { id: 'clear-fresh', name: 'Trong Sáng & Tươi Mới', prompt: 'Apply a clear and fresh color grade. Brighten the image, increase clarity, and enhance cool tones like blues and greens. Create a clean, airy, and modern aesthetic.' },
  { id: 'pure', name: 'Trong Trẻo', prompt: 'Apply a pure and minimalistic color grade. Slightly desaturate colors, ensure clean whites, and create a soft, gentle, and very clean look with minimal color shifting.' },
];


export const PREDEFINED_TRENDS = {
    beggar: {
        label: "Trend Ăn Xin",
        prompt: "A homeless person, sitting hunched on the sidewalk of a city street. They are dressed in ragged, tattered, and patched clothing. Their hands cling tightly to the inner pot of an old, dented, and dusty rice cooker. Important: The face and identity of the homeless person must be identical to the provided reference portrait.",
    },
    figurine: {
        label: "Trend Mô Hình",
        prompt: "A modern-styled character, inspired by the reference portrait, striking a dynamic pose with strong, confident energy. The design is gender-neutral (could be interpreted as male or female). The character has a well-proportioned physique, dressed in fashionable attire suitable for outdoor activities or performances, with sharp detailing and realistic fabric textures. The face is rendered faithfully to the reference portrait, preserving an expression of confidence, focus, and determination. The pose is captured like a moment of action, blending artistic flair with realism.The figure is presented in premium quality, commercial-style (1/7 scale collectible figure), mounted on a transparent acrylic base, and placed on a computer desk.Behind it, the computer screen displays the modeling process of the figure. The entire scene is set in a bright, modern studio with wooden shelves neatly showcasing a collection of figures and models. Multicolored LED lighting reflects softly on the walls and desk, creating a lively, professional, and creatively charged atmosphere. On the back wall, the prominent TG DESIGN AI logo highlights the brand identity. Next to the figure, there is a commercial-style figure box, printed with the original illustration.",
    },
    statue: {
        label: "Trend Nắn Tượng",
        prompt: "Create a commercialized 1/7 scale figure of the character from the reference portrait, designed in a hyper-realistic style and placed within a real-world environment. The model is displayed on a computer desk with a round transparent acrylic base.Beside the desk, the real person from the reference portrait appears at life-size, wearing the same outfit as in both the photo and the figure, carefully holding a screwdriver as if adjusting or repairing the model.The setting is a modern, brightly lit studio, with a collection of toys and figures neatly displayed in the background. Important: The face and identity of both the real person and the figure must be identical to the provided reference portrait.",
    },
};