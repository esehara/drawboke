import {
    Link,
    useParams
} from "react-router-dom";

const testBokeList = [
    "濡れたティッシュを食べる男",
    "自分のiPadにいやらしいケモノの絵を描かれる男",
];

function UserBokeForPictureList() {
    return (
        <div>
            <h1>つけた表題一覧</h1>
            <ul>
                {
                    testBokeList.map((prop, index) => {
                        const title = prop;
                        const boke_id = index.toString(); 
                        return (
                            <li key={boke_id}>
                                <Link to={"/show/boke/" + boke_id}>
                                    <h3>{title}</h3>
                                </Link>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}
const testDrawingList = [
    "mock-love-thumbnail.png",
    "mock-love-thumbnail.png",
];

function UserDrawingList() {
    return (
        <div>
            <h1>描いた絵一覧</h1>
            <ul>
                {testDrawingList.map(
                    (prop, index) => {
                        const draw_path = prop;
                        const draw_id = index.toString();
                        return (
                            <li key={index}>
                                <Link to={"/show/draw/" + draw_id}>
                                    <img src={"/" + draw_path } />
                                </Link>        
                            </li>
                        )
                    }    
                )}
            </ul>
        </div>
    );
}

type UserPageParams = { id: string };
export function UserPage() {
    let { id }  = useParams<UserPageParams>();
    return (
        <div>
            <h1>User: { id }</h1>
            <UserDrawingList />
            <UserBokeForPictureList />
        </div>
    );
}