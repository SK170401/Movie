import { createClient } from "@sanity/client"
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
    projectId: 'biuzzupd',
    dataset: 'production',
    useCdn: false, // set to `false` to bypass the edge cache
    apiVersion: '2023-05-03', // use current date (YYYY-MM-DD) to target the latest API version
    // token: 'skQGxwdkDbiRyBgF3VOnYhRxSCTiZSZY7bpHYMRXGyRhJBYFfp9XOj3OTTrHQIFbPTtHhdAsLtCeVuGr7T1PV3B6Cpcq7Is3suuvSIDFvJIygm8W2bR4Qf2PW5DbYqO6Jo5DVcOy6br6oTyvp2EOKem6kX9IPy1Ys6SV7mWxiu5bRMEKn7dT' // Only if you want to update content with the client
})

// Image URI
const builder = imageUrlBuilder(client)
export function urlFor(source: any) {
    return builder.image(source)
}

// ScreenShots
export async function getScreenshots(source: any) {
    const Images = await client.fetch(`*[_type in ["movie", "series", "bollywood", "bollywoodseries","south","anime","marathi"] && slug.current == "${source}"]{gallery[]}`)
    let Image = []
    Images.map((item: any) => {
        item.gallery?.map((item: any) => {
            Image.push([urlFor(item).url()])
        })
    })
    return Image
}


// Get Data

// Search Movie by user input
export async function search(parameter: any) {
    const Response = await client.fetch(`*[_type in ["movie", "series", "bollywood", "bollywoodseries","south","anime","marathi"] && title match ".*${parameter}*." || genres match ".*${parameter}*." || status match ".*${parameter}*." || slug match ".*${parameter}*." || type match ".*${parameter}*." || origin match ".*${parameter}*." || tags match ".*${parameter}*." || platform match ".*${parameter}*."] | order(releaseDate desc)`)
    return Response
}

// Search by platfrom i.e Netflix, Amazon Prime, Disney+ Hotstar etc
// get All the platforms without duplicate values
export async function getPlatforms(origin) {
    const Platforms = await client.fetch(`array::unique(*[_type in ["movie", "series", "bollywood", "bollywoodseries","south","anime","marathi"] && '${origin}' in origin[] ]{
        "platform": platform[]
    }[].platform[])`)
    let data = Platforms.filter((value: any) => value !== null)
    data.sort()
    return data
}

// get Data by platform
export async function searchByPlatform(platform: any, origin) {
    const Platform = await client.fetch(`
    *[_type in ["movie", "series", "bollywood", "bollywoodseries","south","anime","marathi"] && '${origin}' in origin[] && "${platform}" in platform] | order(releaseDate desc)
    `)
    // *[_type in ["movie", "series"] && "${platform}" in platform] 
    return Platform
}

// getColletion
export async function getCollection(origin) {
    const Collection = await client.fetch(`*[_type == 'collection' && '${origin}' in origin[]]{title, poster} | order(title asc)`)
    // *[_type in ["movie", "series"] && "${platform}" in platform]
    return Collection
}

// getSubColletion
export async function getSubCollection(origin, collection) {
    const Collection = await client.fetch(`*[_type == 'collection' && '${origin}' in origin[] && title == '${collection}']{"subCollection": subCollection[]->{title,poster, movies[]->{title, slug}}| order(title asc)}`)
    return Collection
}

// getSubColletion
export async function getCollectionMovie(origin, movie) {
    const CollectionMovie = await client.fetch(`*[_type == 'subCollection' && '${origin}' in origin[] && title == '${movie}']{movies[]->{title, poster, duration, slug, genres[], releaseDate }| order(releaseDate desc)}`)
    return CollectionMovie[0]?.movies
}

// get Data About Site
export async function getProfile() {
    const Profile = await client.fetch('*[_type == "profile"]')
    return Profile
}

// getData for Home Banner
export async function getLatest() {
    const Movie = await client.fetch('*[_type in ["movie", "series", "bollywood", "bollywoodseries","south","anime","marathi"] && "new" in status || "trending" in status || "upcoming" in status] | order(releaseDate desc)') // Newest Released Date
    // const Movie = await client.fetch('*[_type == "movie"]') // default order
    return Movie
}

// getMovie Data
export async function getMovie(origin) {
    const Movie = await client.fetch(`*[_type in ["movie", "bollywood","south","marathi"] && '${origin}' in origin[]]| order(releaseDate desc)`) // Newest Released Date
    // `*[_type == "movie"]| order(releaseDate desc)`
    // const Movie = await client.fetch('*[_type == "movie"]') // default order
    // console.log(Movie)
    return Movie
}

// get Info page
export async function getInfo() {
    const Info = await client.fetch('*[_type in ["movie", "series", "bollywood", "bollywoodseries","south","anime","marathi"] ]| order(releaseDate desc)') // Newest Released Date
    // const Movie = await client.fetch('*[_type == "movie"]') // default order
    return Info
}

// getComments
export async function getComments(slug: any) {
    const Info = await client.fetch(`*[_type in ["movie", "series", "bollywood", "bollywoodseries","south","anime","marathi"] && slug.current == "${slug}"] {comments[] | order(date desc)}`) // Newest Released Date
    // const Movie = await client.fetch('*[_type == "movie"]') // default order
    return Info
}


export async function getMovieBySlug(slug: any) {
    const Movie = await client.fetch(`*[_type in ["movie", "series", "bollywood", "bollywoodseries","south","anime","marathi"] && slug.current == "${slug}"]`)
    return Movie
}

export async function getGenres(genre: any) {
    const Genres = await client.fetch(`*[_type in ["movie", "series", "bollywood", "bollywoodseries","south","anime","marathi"]  && slug.current == "${genre}"]{genres}`)
    return Genres
}

export async function getMovieByGenre(genre: any, origin) {
    const Genres = await client.fetch(`*[_type in ["movie", "series", "bollywood", "bollywoodseries","south","anime","marathi"] && '${origin}' in origin[]  && "${genre}" in genres[]]| order(releaseDate desc)
    `)
    // *[_type == "movie" && genres[0] == "${genre}"] // checks only first genre
    return Genres
}

// get All the Genres without duplicate values
export async function getAllGenres(origin) {
    const Genres = await client.fetch(`array::unique(*[_type in ["movie", "series", "bollywood", "bollywoodseries","south","anime","marathi"]  && '${origin}' in origin[] ]{
        "genres": genres[]
    }[].genres[])
    `)
    let data = Genres.filter((value: any) => value !== null)
    return data.sort()
}

export async function getOrigin() {
    const Origin = await client.fetch(`array::unique(*[_type in ["movie", "series", "bollywood","bollywoodseries","south","anime","marathi"]]{
        "origin": origin[]
    }[].origin[])
    `)
    let data = Origin.filter((value: any) => value !== null)
    return data
}
export async function getOriginMovie() {
    const Origin = await client.fetch(`array::unique(*[_type in ["movie", "series", "bollywood", "bollywoodseries","south","anime","marathi"]]{
        "origin": origin[]
    }[].origin[] | order(value asc))
    `)
    let data = Origin.filter((value: any) => value !== null)
    return data.sort()
}

//
export async function getSeries(origin) {
    const Movie = await client.fetch(`*[_type in ["series", "bollywoodseries","anime"] && '${origin}' in origin[]] | order(releaseDate desc)`) // Newest Released Date
    return Movie
}
// Get All Download Links On Current Slug

export async function getDownloads(link: any) {
    const Download = await client.fetch(`*[_type in ["movie", "series", "bollywood", "bollywoodseries","south","anime","marathi"] && slug.current == "${link}"]{download}`)
    return Download
}

//

export async function getEpisodes(link: any) {
    const Episode = await client.fetch(`*[_type in ["series", "bollywoodseries","anime"] && slug.current == "${link}"]{episodes}`)
    return Episode
}

export async function getEpHD(link: any) {
    const EpHD = await client.fetch(`*[_type in ["series", "bollywoodseries"]" && slug.current == "${link}"]{episodes}`)
    let data: any
    EpHD?.map((item: any) => {
        item.episodes?.map((item: any) => {
            data = item
        })
    })
    return data
}

export async function getEpFHD(link: any) {
    const EpFHD = await client.fetch(`*[_type in ["series", "bollywoodseries"] && slug.current == "${link}"]{episodes}`)
    let data: any
    EpFHD?.map((item: any) => {
        item.episodes?.map((item: any) => {
            data = item
        })
    })
    return data
}

export async function getEpUHD(link: any) {
    const EpUHD = await client.fetch(`*[_type in ["series", "bollywoodseries"] && slug.current == "${link}"]{episodes}`)
    let data: any
    EpUHD?.map((item: any) => {
        item.episodes?.map((item: any) => {
            data = item
        })
    })
    return data
}