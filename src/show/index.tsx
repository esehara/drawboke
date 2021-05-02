import {
    Link,
    useParams
} from "react-router-dom";

type ShowDrawingPageParam = { id: string };
export function ShowDrawingPage() {
    let { id } = useParams<ShowDrawingPageParam>();

    return (
        <div>
            <h1>id: {id}</h1>
            <img src="/mock-love-thumbnail.png" alt=""/>
            <ul>
                <li><Link to="/show/boke/1"><h3>ティッシュを間違えて食べそうな顔</h3></Link></li>
                <li><Link to="/show/boke/2"><h3>背が高そう</h3></Link></li>
            </ul>
        </div>
    )
}

type ShowCaptionPageParam = {id: string};
export function ShowCaptionPage() {
    let { id } = useParams<ShowCaptionPageParam>();
    return (
        <div>
            <h1>id: {id} </h1>
            <h1>ソーシャルメディアで男を口説いてそうな顔</h1>
            <ul>
                <li><Link to="/show/draw/1"><img src="/mock-love-thumbnail.png" alt=""/></Link></li>
                <li><Link to="/show/draw/2"><img src="/mock-love-thumbnail.png" alt=""/></Link></li>
            </ul>
        </div>
    )
}