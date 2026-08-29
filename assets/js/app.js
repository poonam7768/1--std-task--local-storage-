const cl = console.log;

const todoform = document.getElementById('todoform')
const fname = document.getElementById('fname')
const lname = document.getElementById('lname')
const subject = document.getElementById('subject')
const tableInfo= document.getElementById('tableInfo')
const addbtn = document.getElementById('addbtn')
const updatebtn = document.getElementById('updatebtn')


// let Array = [
//     {
//       stdId:"11",
//       stdfname:"May",
//       stdlname:"Doe",
//       stdsubject:"Html"
//     },
//     {
//      stdId:"12",
//      stdfname:"Merry",
//      stdlname:"Doe",
//      stdsubject:"Javascript"   
//     }
// ]

//  localStorage.setItem("stdArr",JSON.stringify(Array))

 let stdArr =JSON.parse(localStorage.getItem('stdArr')) || [];


//read

function oncreate(arr){
    let result = ``
    arr.forEach((t,i) => {
        result += `<tr id="${t.stdId}">
                        <td>${i+1}</td>
                        <td>${t.stdfname}</td>
                        <td>${t.stdlname}</td>
                        <td>${t.stdsubject}</td>
                        <td><button onclick="onedit(this)" class="btn btn-sm btn-primary">Edit</button></td>
                        <td><button onclick="ondelete(this)" class="btn btn-sm btn-danger">delete</button></td>
                    </tr>` 
    })
    tableInfo.innerHTML = result

}

oncreate(stdArr)

//create 
function onAddstd(eve){
    eve.preventDefault();

    let newObj ={
        stdId:Date.now().toString(),
        stdfname:fname.value,
        stdlname:lname.value,
        stdsubject:subject.value
    }

    stdArr.push(newObj)
    todoform.reset()
    localStorage.setItem("stdArr",JSON.stringify(stdArr))
    let tr = document.createElement('tr')
    tr.className = 'table table-bordered'
    tr.setAttribute('id',newObj.stdId)
    tr.innerHTML = `    
                        <td>${stdArr.length}</td>
                        <td>${newObj.stdfname}</td>
                        <td>${newObj.stdlname}</td>
                        <td>${newObj.stdsubject}</td>
                        <td><button onclick="onedit(this)" class="btn btn-sm btn-primary">Edit</button></td>
                        <td><button onclick="ondelete(this)" class="btn btn-sm btn-danger">delete</button></td>
                   `
                   tableInfo.append(tr)
}

//delete

function ondelete(ele){
    let removeId = ele.closest('tr').id
    let getConfirmation = confirm('Are you sure ? you want to delete ?')
    if(getConfirmation){
        let getIndex = stdArr.findIndex(t => t.stdId === removeId)
        stdArr.splice(getIndex,1)
        localStorage.setItem("stdArr",JSON.stringify(stdArr))
        ele.closest('tr').remove()

        let tds = [...document.querySelectorAll('#tableInfo tr td:first-child')]
        tds.forEach((td,i)=>{
            td.innerText = i + 1
        })
    }
}

//edit
function onedit(ele){
    let editId = ele.closest('tr').id
    localStorage.setItem('updateId',editId)
    let editObj = stdArr.find(t=>t.stdId === editId)
   
    fname.value = editObj.stdfname ;
    lname.value = editObj.stdlname;
    subject.value = editObj.stdsubject;

    addbtn.classList.add('d-none')
    updatebtn.classList.remove('d-none')

}


//update
function onupdte(eve){
    let updateId = localStorage.getItem("updateId")
    cl(updateId)
    localStorage.removeItem("updateId")
    let updatedObj = {
        stdId:updateId,
        stdfname:fname.value,
        stdlname:lname.value,
        stdsubject:subject.value
    }
    let getIndex = stdArr.findIndex(t => t.stdId === updateId)
    stdArr[getIndex] = updatedObj

    localStorage.setItem("stdArr",JSON.stringify(stdArr))
    let tr = document.getElementById(updateId).children;

    tr[1].innerText = updatedObj.stdfname
    tr[2].innerText = updatedObj.stdlname
    tr[3].innerText = updatedObj.stdsubject

    addbtn.classList.remove('d-none')
    updatebtn.classList.add('d-none')

    todoform.reset()
}




todoform.addEventListener('submit',onAddstd)
updatebtn.addEventListener('click',onupdte)
