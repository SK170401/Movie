import { getOriginMovie } from "@/api/client"
import { useCallback, useEffect, useState } from "react"
import { Button } from "../ui/button"
import { SkeletonByOrigin } from "./SkeletonMoviesByGenres"
import { useOrigin } from "@/Context/OriginContext"

const ByOrigin = ({ cachefnc }) => {
    const [data, setData] = useState([])
    const [isLoading, setisLoading] = useState(true)
    const { origin } = useOrigin()

    const fetchData = useCallback(async () => {
        const data = await getOriginMovie();
        setData(data);
    }, []);

    const onClickHandler = (item) => {
        cachefnc(item)
    }

    useEffect(() => {
        fetchData();
        setTimeout(() => {
            setisLoading(false)
        }, 300);
    }, [fetchData]);

    return (
        <section className="grid gap-3">
            <h2 className="font-semibold text-xl">
                Select Origin:
            </h2>
            <div className="flex gap-3 justify-center min-h-10">
                {
                    isLoading && <SkeletonByOrigin />
                }

                {
                    !isLoading && data &&
                    <div className="flex gap-3 flex-wrap justify-center">
                        {
                            data.map((item, idx) => {
                                return <Button key={idx} className={`${item == origin ? 'text-white bg-red-600' : ''} capitalize rounded-full hover:bg-n`} onClick={() => onClickHandler(item)}>
                                    {item}
                                </Button>
                            })
                        }
                    </div>
                }
            </div>
        </section>
    )
}

export default ByOrigin