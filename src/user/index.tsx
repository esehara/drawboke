import {useParams} from "react-router-dom";

const testBokeList = [
    "濡れたティッシュを食べる男",
    "自分のiPadにいやらしいケモノの絵を描かれる男"
];
function UserBokeForPictureList() {
    return (
        <div>
            <h1>つけた表題一覧</h1>
            <ul>
                {
                    testBokeList.map((prop, index) => {
                        const title = prop;
                        return (
                            <li key={index}>
                                <h2>{title}</h2>
                                <img src="/mock-love-thumbnail.png" alt=""/>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

function UserDrawPictureList() {
    return (
        <div>
            <h1>描いた絵一覧</h1>
            <ul>
                <li>
                    <img src="/mock-love-thumbnail.png" alt=""/>
                </li>
            </ul>
        </div>
    );
}

type UserPageParams = { user_id: string };
export function UserPage() {
    let { user_id }  = useParams<UserPageParams>();
    return (
        <div>
            <h1>User: { user_id }</h1>
            <UserDrawPictureList />
            <UserBokeForPictureList />
        </div>
    );
}