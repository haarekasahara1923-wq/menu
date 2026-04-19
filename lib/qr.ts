import QRCode from 'qrcode'

export async function generateMenuQR(baseUrl: string): Promise<string> {
  const menuUrl = `${baseUrl}/menu`
  return QRCode.toDataURL(menuUrl, {
    width: 400,
    margin: 2,
    color: { dark: '#B5451B', light: '#FFF8F0' },
    errorCorrectionLevel: 'H',
  })
}
