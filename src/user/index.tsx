import {useParams} from "react-router-dom";

function UserBokeForPictureList() {
    return (
        <div>
            <h1>つけた表題一覧</h1>
            <ul>
                <li>濡れたティッシュを食べる男</li>
                <li>自分のiPadにいやらしいケモノの絵を描かれる男</li>
            </ul>
        </div>
    )
}

function UserDrawPictureList() {
    return (
        <div>
            <h1>描いた絵一覧</h1>
            <ul>
                <li></li>
            </ul>
        </div>
    );
}

type UserPageParams = { user_id: string };
export function UserPage() {
    let { user_id }  = useParams<UserPageParams>();
    return (
        <div>
            <h1>{ user_id }</h1>
            <UserDrawPictureList />
            <UserBokeForPictureList />
        </div>
    );
}