const NASA_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

// Fallback Mars rover photos using publicly accessible NASA images
const FALLBACK_PHOTOS = [
    { id: 1, sol: 1000, img_src: 'https://images-assets.nasa.gov/image/PIA19920/PIA19920~thumb.jpg', earth_date: '2015-05-30', camera: { name: 'NAVCAM', full_name: 'Navigation Camera' }, rover: { name: 'Curiosity' } },
    { id: 2, sol: 1000, img_src: 'https://images-assets.nasa.gov/image/PIA17944/PIA17944~thumb.jpg', earth_date: '2015-05-30', camera: { name: 'FHAZ', full_name: 'Front Hazard Avoidance Camera' }, rover: { name: 'Curiosity' } },
    { id: 3, sol: 1000, img_src: 'https://images-assets.nasa.gov/image/PIA16768/PIA16768~thumb.jpg', earth_date: '2015-05-30', camera: { name: 'MAST', full_name: 'Mast Camera' }, rover: { name: 'Curiosity' } },
    { id: 4, sol: 1000, img_src: 'https://images-assets.nasa.gov/image/PIA19808/PIA19808~thumb.jpg', earth_date: '2015-05-30', camera: { name: 'NAVCAM', full_name: 'Navigation Camera' }, rover: { name: 'Curiosity' } },
    { id: 5, sol: 1000, img_src: 'https://images-assets.nasa.gov/image/PIA22226/PIA22226~thumb.jpg', earth_date: '2015-05-30', camera: { name: 'MAST', full_name: 'Mast Camera' }, rover: { name: 'Curiosity' } },
    { id: 6, sol: 1000, img_src: 'https://images-assets.nasa.gov/image/PIA16105/PIA16105~thumb.jpg', earth_date: '2015-05-30', camera: { name: 'RHAZ', full_name: 'Rear Hazard Avoidance Camera' }, rover: { name: 'Curiosity' } },
    { id: 7, sol: 1000, img_src: 'https://images-assets.nasa.gov/image/PIA16239/PIA16239~thumb.jpg', earth_date: '2015-05-30', camera: { name: 'MAST', full_name: 'Mast Camera' }, rover: { name: 'Curiosity' } },
    { id: 8, sol: 1000, img_src: 'https://images-assets.nasa.gov/image/PIA19839/PIA19839~thumb.jpg', earth_date: '2015-05-30', camera: { name: 'NAVCAM', full_name: 'Navigation Camera' }, rover: { name: 'Curiosity' } },
    { id: 9, sol: 1000, img_src: 'https://images-assets.nasa.gov/image/PIA17931/PIA17931~thumb.jpg', earth_date: '2015-05-30', camera: { name: 'CHEMCAM', full_name: 'Chemistry and Camera Complex' }, rover: { name: 'Curiosity' } },
    { id: 10, sol: 1000, img_src: 'https://images-assets.nasa.gov/image/PIA23623/PIA23623~thumb.jpg', earth_date: '2015-05-30', camera: { name: 'NAVCAM', full_name: 'Navigation Camera' }, rover: { name: 'Curiosity' } },
    { id: 11, sol: 1000, img_src: 'https://images-assets.nasa.gov/image/PIA16453/PIA16453~thumb.jpg', earth_date: '2015-05-30', camera: { name: 'MAST', full_name: 'Mast Camera' }, rover: { name: 'Curiosity' } },
    { id: 12, sol: 1000, img_src: 'https://images-assets.nasa.gov/image/PIA16550/PIA16550~thumb.jpg', earth_date: '2015-05-30', camera: { name: 'FHAZ', full_name: 'Front Hazard Avoidance Camera' }, rover: { name: 'Curiosity' } },
];

function getFallback(camera) {
    let photos = FALLBACK_PHOTOS;
    if (camera) {
        photos = photos.filter(p => p.camera.name.toLowerCase() === camera.toLowerCase());
    }
    return Response.json({ photos });
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const rover = searchParams.get('rover') || 'curiosity';
    const sol = searchParams.get('sol') || '1000';
    const camera = searchParams.get('camera') || '';

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}${camera ? `&camera=${camera}` : ''}&api_key=${NASA_KEY}`;
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);

        if (!res.ok) {
            return getFallback(camera);
        }

        const data = await res.json();
        if (data.photos && data.photos.length > 0) {
            return Response.json(data);
        }
        return getFallback(camera);
    } catch (err) {
        return getFallback(camera);
    }
}
