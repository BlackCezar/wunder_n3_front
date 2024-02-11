export default defineEventHandler((event) => {
    const query = getQuery(event)

    // return fetch(process.env.BACKEND_HOST + `/api/documents/public/${query.type}/${query.name}`)
    return sendRedirect(event, `${process.env.BACKEND_HOST}/api/documents/public/${query.type}/${query.name}`, 302)
})