import { useRouteErrorr, isRouteErrorResponse } from 'react-router-dom';

export const ErrorPage = () => {
    const error = useRouteError();

    //1 вариант ошибки
    /*    return (
            <div>
                <h1>{error.status}</h1>
                <p>{error.statusText || 'Unknown error!'}</p>
            </div>
        )*/

    //isRouteErrorResponse(error) - проверка ошибка произошла ли на ур-не роутинга
    if (isRouteErrorResponse(error)) {
        //2 вариант
        // error.data - то что положили 1-ым параметром - {message: 'Not found', reason: 'wrong url'}

        return (
            <div>
                <h1>{error.status}</h1>
                <p>{error.data.message}</p>
                <p>{error.data.reason}</p>
            </div>
        )
    }

    // return <div>Error something!</div>
    //прокинем дальше ошибку - для ErrorBoundry
    return error
}