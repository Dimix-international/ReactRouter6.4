import { Suspense } from 'react'
import { Await, defer, Link, useAsyncValue, useLoaderData, useNavigate } from 'react-router-dom'

const Post = () => {
    const post = useAsyncValue(); //получаем данные

    return (
        <>
            <h1>{post.title}</h1>
            <p>{post.body}</p>
        </>
    )
}

const Comments = () => {
    const comments = useAsyncValue()

    return (
        <div>
            <h2>Comments</h2>
            {comments.map(comment => (
                <>
                    <h3>{comment.email}</h3>
                    <h4>{comment.name}</h4>
                    <p>{comment.body}</p>
                </>
            ))}
        </div>
    )
}

const Singlepage = () => {
    const { post, id, comments } = useLoaderData()
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <div>
            <button onClick={goBack}>Go back</button>
            <Suspense fallback={<h2>Post is loading...</h2>}>
                <Await resolve={post}>
                    <Post />
                </Await>
            </Suspense>
            <Suspense fallback={<h2>Comments is loading...</h2>}>
                <Await resolve={comments}>
                    <Comments />
                </Await>
            </Suspense>
            <Link to={`/posts/${id}/edit`}>Edit this post</Link>
        </div>
    )
}

async function getPostById(id) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
    return res.json()
}
async function getCommentsByPost(id) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`)
    return res.json()
}


const postLoader = async ({ params }) => {
    const id = params.id;

    // если не использовать defer то мы пока не получим данные, будем висеть на странице
    // defer позволяет нам разделить сущности загрузки, т.е. какие-то данные мы дожидаемся и после переходим на страницу,
    // а какие-то подгрузим когда перейдём на страницу и <Await /> но не забываем
    // использовать Suspense
    //resolve in Await - что мы будем дожидатся
    // т.е. все будет показано вокруг Suspense, а внутри будет не показано пока не загрузятся посты

    // в доке написано про defer - если мы хотим дожидаться данных не переходя на страницу - НЕ пишем defer, иначе пишем
    // и используем Suspense, Await

    //сначала нам нужен пост - await, а комменты загрузим уже внутри страницы
    // на страницу попадем только после загрузки поста
    return defer({ post: await getPostById(id), id, comments: getCommentsByPost(id) })
}

export { Singlepage, postLoader }
