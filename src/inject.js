chrome.extension.sendMessage({}, function (response) {
    var readyStateCheckInterval = setInterval(function () {
        if (document.readyState === 'complete') {
            clearInterval(readyStateCheckInterval);

            // ----------------------------------------------------------
            // This part of the script triggers when page is done loading
            // ----------------------------------------------------------
            const addNewIndexLink = document.querySelector(
                '#newapply[rurl="/man-hour/admin/logTable/addNewIndex.html"]'
            );
            addNewIndexLink.click();
            const iframe = document.querySelector('iframe');
            iframe.onload = function () {
                const iframeDoc = iframe.contentWindow.document;
                // 点击新增
                if (iframeDoc.title == '工时管理22222') {
                    const addBtn = iframeDoc.querySelector('.addBtn');
                    addBtn.click();
                } else {
                    const workTypes = await getWorkTypes();
                    const linkItemMsg = await getLinkItemMsg();
                    const linkTaskType = await getLinkTaskType();

                    // sendLog();
                }
            }
        }
    }, 10);
});
const partUrl = 'http://it.bbdservice.com:8988/man-hour/admin';

async function getWorkTypes() {
    const response = await fetch(
        partUrl + '/workTypeLink/getWorkTypes.html'
    )
        .then(r => r.json());
    return response;
    // .then(response => {
    //     chrome.storage.local.set({ workType: response }, function () {
    //         console.log('workType Value is set to ');
    //     });
    // });

}

async function getLinkItemMsg() {
    const date = new Date();
    const response = await fetch(
        partUrl + '/itemMsg/getLinkItemMsg.html',
        { parentDate: getDate(date) }
    )
        .then(r => r.json());
    chrome.stora
}

async function getLinkTaskType() {
    const date = new Date();
    const response = await fetch(
        partUrl + '/workTypeLink/getLinkTaskType.html',
        { parentDate: '940852075975733252' }
    )
        .then(r => r.json());
    return response;
}

function sendLog() {
    const curr = new Date();
    const lastFiveDaysData = [];
    const defaultValue = {
        logTableChildrenId: '',
        parentTime: '18:11:55',
        childrenStatus: 0, // 0
        workTypeId: '', //
        childrenDate: '',  // '2019-12-8'
        childrenRemark: '修改bug',
        itemMsgId: '',  //
        taskTypeId: '', // 
        childrenDateNum: '',
        childrenNode: '修改bug'
    };
    Array.apply(null, Array(5)).forEach((value, index) => {
        const someDate = new Date();
        someDate.setDate(curr.getDate() - index);
        lastFiveDaysData.push({ ...defaultValue, childrenDate: getDate(someDate) });
    })
    const childrenList = [
        {
            logTableChildrenId: '',
            parentTime: '', // '18:11:55'
            childrenStatus: '', // 0
            workTypeId: '', //
            childrenDate: '',  // '2019-12-8'
            childrenRemark: '', // '修改bug'
            itemMsgId: '',  //
            taskTypeId: '', // 
            childrenDateNum: '',
            childrenNode: '' // '修改bug'
        }
    ]
    // const formData = new FormData();
    // childrenList.forEach((value, index) => {
    //     for (const key in value) {
    //         formData.append('childrenList[' + index + '].' + key, value[key]);
    //     }
    // })
    // const response = await fetch(partUrl + '/logTable/saveLogTable.html', {
    //     method: 'POST',
    //     body: JSON.stringify(data)
    // });
    // return await response.json();
}

function getDate(date) {
    return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
}
