export interface KakaoAddressResult {
  placeName: string
  addressName: string
  roadAddressName: string
  lat: number
  lng: number
}

export async function searchKakaoAddress(query: string): Promise<KakaoAddressResult[]> {
  const key = process.env.KAKAO_REST_API_KEY
  if (!key) throw new Error("KAKAO_REST_API_KEY is not set")

  const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&size=5`
  const res = await fetch(url, {
    headers: { Authorization: `KakaoAK ${key}` },
    next: { revalidate: 0 },
  })
  if (!res.ok) throw new Error("Kakao address search failed")

  const data = await res.json()
  return (data.documents ?? []).map((doc: Record<string, string>) => ({
    placeName: doc.place_name,
    addressName: doc.address_name,
    roadAddressName: doc.road_address_name ?? doc.address_name,
    lat: parseFloat(doc.y),
    lng: parseFloat(doc.x),
  }))
}
