export const useFormat = () => {
    const formatter = new Intl.NumberFormat('ru-RU', {
        maximumFractionDigits: 4
    })

    return {
        formatter
    }
}