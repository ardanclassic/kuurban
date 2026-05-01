import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kuurban - Musala Al Ukhuwah',
    short_name: 'Kuurban',
    description: 'Portal Info & Pendaftaran Kurban Musala Al Ukhuwah',
    start_url: '/',
    display: 'standalone',
    background_color: '#fffbeb',
    theme_color: '#f59e0b',
    icons: [
      {
        src: '/icon.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
