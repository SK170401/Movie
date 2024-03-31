import { getProfile, urlFor } from "@/api/client"
import Banner from "@/components/Banner"
import HomeMovieSection from "@/components/HomeMovieSection"
import MoviesByGenres from "@/components/MoviesByGenres/MoviesByGenres"
import { useEffect, useState } from "react"

const Hero = () => {

    const [profile, setProfile] = useState([])

    useEffect(() => {
        (async () => {
            const data = (await getProfile())
            setProfile(data)
        })()
    }, [])

    return (
        <>
            <div className="m-auto max-w-[1536px] px-5 min-h-screen">
                <div className="absolute top-0 left-0 right-0 -z-10 w-full h-screen">
                    {profile.map((item, idx) => {
                        return <img key={idx} src={urlFor(item.image).url()} className="h-[450px] w-full object-cover object-top pointer-events-none select-none backdrop-brightness-50" alt={item.slug.current} draggable={false} />
                    })}
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t dark:hidden from-white from-55% via-transparent to-white  " />
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t hidden dark:block from-black from-55% via-transparent to-black " />
                </div>
                <div className="mt-32">
                    <Banner></Banner>
                </div>
                <MoviesByGenres></MoviesByGenres>
                <HomeMovieSection />
            </div>
        </>
    )
}

export default Hero