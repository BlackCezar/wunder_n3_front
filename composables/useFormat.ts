export const useFormat = () => {
    const formatter = new Intl.NumberFormat('ru-RU', {
        maximumFractionDigits: 2
    })

    return {
        formatter
    }
}