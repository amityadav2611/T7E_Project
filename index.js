const ObjectsToCsv = require('objects-to-csv')

let logText = `157.48.157.220 - - [05/Oct/2022:11:13:54 +0530] "GET /img/banner/impmsg.jpg HTTP/1.1" 200 220044 "-" devipeniclubapi.t7e.in "Dalvik/2.1.0 (Linux; U; Android 12; V2050 Build/SP1A.210812.003)"
157.48.157.220 - - [05/Oct/2022:11:14:01 +0530] "GET /img/rewardcategoriesicons/vehicle.png HTTP/1.1" 200 10217 "-" devipeniclubapi.t7e.in "Dalvik/2.1.0 (Linux; U; Android 12; V2050 Build/SP1A.210812.003)"
157.48.157.220 - - [05/Oct/2022:11:14:01 +0530] "GET /img/rewardcategoriesicons/home.png HTTP/1.1" 200 6069 "-" devipeniclubapi.t7e.in "Dalvik/2.1.0 (Linux; U; Android 12; V2050 Build/SP1A.210812.003)"
157.48.157.220 - - [05/Oct/2022:11:14:01 +0530] "GET /img/rewardcategoriesicons/electronics.png HTTP/1.1" 200 3214 "-" devipeniclubapi.t7e.in "Dalvik/2.1.0 (Linux; U; Android 12; V2050 Build/SP1A.210812.003)"
157.44.179.105 - - [05/Oct/2022:11:14:09 +0530] "GET /img/banner/covidbanner/malayalam.jpg HTTP/1.1" 200 110433 "-" devipeniclubapi.t7e.in "Dalvik/2.1.0 (Linux; U; Android 12; M2101K7AI Build/SKQ1.210908.001)"
157.44.179.105 - - [05/Oct/2022:11:14:09 +0530] "GET /img/banner/impmsg.jpg HTTP/1.1" 200 220044 "-" devipeniclubapi.t7e.in "Dalvik/2.1.0 (Linux; U; Android 12; M2101K7AI Build/SKQ1.210908.001)"
157.38.58.74 - - [05/Oct/2022:11:14:30 +0530] "GET /img/banner/covidbanner/hindi.jpg HTTP/1.1" 200 91203 "-" devipeniclubapi.t7e.in "Dalvik/2.1.0 (Linux; U; Android 10; M2006C3LII MIUI/V12.0.24.0.QCDINXM)"
157.38.58.74 - - [05/Oct/2022:11:14:30 +0530] "GET /img/banner/impmsg.jpg HTTP/1.1" 200 220044 "-" devipeniclubapi.t7e.in "Dalvik/2.1.0 (Linux; U; Android 10; M2006C3LII MIUI/V12.0.24.0.QCDINXM)"
157.38.58.74 - - [05/Oct/2022:11:14:38 +0530] "GET /img/banner/covidbanner/hindi.jpg HTTP/1.1" 200 91203 "-" devipeniclubapi.t7e.in "Dalvik/2.1.0 (Linux; U; Android 10; M2006C3LII MIUI/V12.0.24.0.QCDINXM)"
157.38.58.74 - - [05/Oct/2022:11:14:40 +0530] "GET /img/banner/impmsg.jpg HTTP/1.1" 200 220044 "-" devipeniclubapi.t7e.in "Dalvik/2.1.0 (Linux; U; Android 10; M2006C3LII MIUI/V12.0.24.0.QCDINXM)"
157.35.41.7 - - [05/Oct/2022:11:14:56 +0530] "GET /img/banner/impmsg.jpg HTTP/1.1" 200 220044 "-" devipeniclubapi.t7e.in "Dalvik/2.1.0 (Linux; U; Android 12; SM-M317F Build/SP1A.210812.016)"
157.35.41.7 - - [05/Oct/2022:11:14:57 +0530] "GET /img/banner/covidbanner/hindi.jpg HTTP/1.1" 200 91203 "-" devipeniclubapi.t7e.in "Dalvik/2.1.0 (Linux; U; Android 12; SM-M317F Build/SP1A.210812.016)"
42.111.19.111 - - [05/Oct/2022:11:15:20 +0530] "GET /img/banner/covidbanner/hindi.jpg HTTP/1.1" 200 91203 "-" devipeniclubapi.t7e.in "Dalvik/2.1.0 (Linux; U; Android 12; CPH2381 Build/RKQ1.211119.001)"
42.111.19.111 - - [05/Oct/2022:11:15:20 +0530] "GET /img/banner/impmsg.jpg HTTP/1.1" 200 220044 "-" devipeniclubapi.t7e.in "Dalvik/2.1.0 (Linux; U; Android 12; CPH2381 Build/RKQ1.211119.001)"
`;


function convert_log_text_to_arr(logText) {
    logText = logText.trim()
    const array = logText.split('\n') || []

    return array.map((each => {
        return convert_each_log_to_object(each)
    }))
}

function convert_each_log_to_object(string) {
    const splitData = string.split('- -')
    // for get ip address
    const ip_address = splitData[0] || 'unavalable'

    // for get date
    const start = splitData[1].indexOf('[')
    const end = splitData[1].indexOf(']')
    let dateIs = Date(splitData[1].substring(start + 1 , end)) 
    dateIs = new Date(dateIs)

    // return object
    return {
        ip: ip_address.trim(),
        date: `${dateIs.getDay()}-${dateIs.getMonth() + 1}-${dateIs.getFullYear()}`
    }
}


function make_ip_unique_return_arr(array) {
    const map = {}

    for (let each of array) {
        if (map[each.ip]) {
            map[each.ip].count = map[each.ip].count + 1
            map[each.ip].date = each.date
        } else {
            map[each.ip] = {
                count: 1,
                date: each.date
            }
        }
    }

    // convert obj to arr
    const arx = []
    for (let each in map) {
        arx.push({
            "Uniq IP List": each,
            "No Times occurance": map[each].count,
            "Date": map[each].date
        })
    }
    return arx
}


async function mainFn(logText) {
    try {
        const arr = convert_log_text_to_arr(logText)
        const uniqueArr = make_ip_unique_return_arr(arr)
        const csv = new ObjectsToCsv(uniqueArr)
        await csv.toDisk(`./logs/${new Date().getTime()}.csv`)
        console.log('csv file created successfully!')
    } catch (e) {
        console.log('Error:', e.message)
    }
}

mainFn(logText) 