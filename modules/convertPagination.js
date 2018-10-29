const convertPagination = function(resouce, currentPage){
    //   pagination start
    const totalResult = resouce.length
    const perpage = 3 //    每頁三筆資料
    const pageTotal = Math.ceil(totalResult / perpage) //    總頁數
    // let currentPage = 1 //假設目前業為第二頁
    if(currentPage > pageTotal){currentPage = pageTotal}
    //   if(currentPage < 0){currentPage = 1}

    const minItem = (currentPage * perpage) - perpage + 1 //(當前數量 * 每頁幾筆資料) - 每頁幾筆資料 + 1
    const maxItem = (currentPage * perpage) //(當前數量 * 每頁幾筆資料)
    const data = []

    resouce.forEach(function(item, i){
        // console.log(item, i)
        let itemNum = i + 1
        if( itemNum >= minItem && itemNum <= maxItem){
            data.push(item)
        }
    })

    const page = {
        pageTotal,
        currentPage,
        hasPre: currentPage > 1,
        hasNext: currentPage < pageTotal
    }

    return {
        page,
        data
    }

    //   console.log(totalResult, pageTotal, minItem, maxItem)
    //   pagination end
}

module.exports = convertPagination