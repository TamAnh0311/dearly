-- Update story text for thao-tamanh wedding
UPDATE weddings
SET story_text = E'Năm năm bên nhau, cùng trải qua những niềm vui, cả những lúc giận hờn, chúng mình càng hiểu rằng đối phương chính là người mà mình muốn cùng đi qua những năm tháng phía trước.\n\nGiờ đây,  chúng mình đã sẵn sàng cùng nhau bắt đầu một hành trình mới, xây dựng mái ấm nhỏ và viết tiếp câu chuyện tình yêu, với sự bao dung và yêu thương.'
WHERE slug = 'thao-tamanh';

-- Add Taylor Swift - Labyrinth as a music track (copyright disclaimer shown in editor)
INSERT INTO music_tracks (id, name, artist, genre, duration_seconds, url, is_featured, created_at)
VALUES (
  gen_random_uuid(),
  'Labyrinth',
  'Taylor Swift',
  'romantic',
  247,
  '/audio/taylor-swift-labyrinth.mp3',
  false,
  now()
);

-- Set the track as BGM for thao-tamanh wedding
UPDATE weddings
SET music_url = '/audio/taylor-swift-labyrinth.mp3'
WHERE slug = 'thao-tamanh';
