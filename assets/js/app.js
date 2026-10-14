const cl = console.log;

const stdform = document.getElementById('stdform')
const fname = document.getElementById('fname')
const lname = document.getElementById('lname')
const subject = document.getElementById('subject')
const tableInfo= document.getElementById('tableInfo')
const addbtn = document.getElementById('addbtn')
const updatebtn = document.getElementById('updatebtn')
const spinner = document.getElementById('spinner')

const BASE_URL = `https://crud-dfd04-default-rtdb.firebaseio.com/`
const student_url = `${BASE_URL}student.json`


 const state ={
    stdArr : [],
    stdedit_id : null,
}

function objToArr(obj){
    for(const key in obj){
        obj[key].id = key;
        state.stdArr.unshift(obj[key])
    }
}

function handleSpinner(flag){
    if(flag){
        spinner.classList.remove('d-none')
    }else{
        spinner.classList.add('d-none')
    }
}


function snackBar(msg,icon){
    Swal.fire({
        title:msg,
        timer:3000,
        icon:icon
    })
}

function makeApiCall(url,methodName,body=null){
    return fetch(url,{
        method:methodName,
        headers:{
            "Content-Type":"application/json",
            "auth":"JWT token"
        },
        body:body ? JSON.stringify(body) : null
    })
     .then(res=>{
        if(!res.ok){
            throw new Error ()
        }
        return res.json()
     })
}



//read

function oncreate(){
    handleSpinner(true)
    makeApiCall(student_url,"GET")
     .then((data)=>{
         cl(data)
         objToArr(data)
         templiting(state.stdArr)
     })
      .catch(err=>{
        snackBar("something went wrong!!","error")
      })
       .finally(()=>{
        handleSpinner()
       })
}
oncreate()

function templiting(arr){
    let result = ``
    arr.forEach((t,i) => {
        result += `<tr id="${t.id}">
                        <td>${i+1}</td>
                        <td>${t.fname}</td>
                        <td>${t.lname}</td>
                        <td>${t.subject}</td>
                        <td><button onclick="onedit(this)" class="btn btn-sm btn-primary">Edit</button></td>
                        <td><button onclick="ondelete(this)" class="btn btn-sm btn-danger">delete</button></td>
                    </tr>` 
    })
    tableInfo.innerHTML = result
}


//create 
function onAddstd(eve){
    eve.preventDefault();

    let newObj ={
        fname:fname.value,
        lname:lname.value,
        subject:subject.value
    }
    handleSpinner(true)
    makeApiCall(student_url,"POST",newObj)
      .then(res=>{
        cl(res)
        newObj.id = res.name
        state.stdArr.unshift(newObj)
        templiting(state.stdArr)
        snackBar(`new student added successfully!`,'success')
        stdform.reset()
      })
       .catch(err=>{
        snackBar(err,'error')
       })
      .finally(()=>{
        handleSpinner()
      })
}

//delete
function ondelete(ele){
    let removeId = ele.closest('tr').id

         Swal.fire({
  title: "Are you sure?",
  icon: "warning",
  showCancelButton: true,
  
  confirmButtonText: "Yes, Remove it!"
}).then((result) => {
  if (result.isConfirmed){
    handleSpinner(true)
    let remove_url = `${BASE_URL}student/${removeId}.json`
    makeApiCall(remove_url,"DELETE")
     .then(res=>{
        let getIndex = state.stdArr.findIndex(s=>s.id === removeId)
        state.stdArr.splice(getIndex,1)
        ele.closest('tr').remove()

         let td = [...document.querySelectorAll("#tableInfo tr td:first-child")];
                       td.forEach((td,i)=>{
                        td.innerHTML = i+1
                       })
        snackBar(`The Data Removed Successfully !!!`,'success')
     })
     .catch(err=>{
        snackBar(err,'error')
     })
     .finally(()=>{
        handleSpinner()
     })
  }
})
}
//edit

function onedit(ele){
    let editId = ele.closest('tr').id
    state.stdedit_id = editId
    let editObj = state.stdArr.find(s=>s.id === editId)

    fname.value = editObj.fname,
    lname.value = editObj.lname,
    subject.value = editObj.subject

    addbtn.classList.add('d-none')
    updatebtn.classList.remove('d-none')

}

//update

function onupdate(eve){
    let updateId = state.stdedit_id;
    let updateURl = `${BASE_URL}student/${updateId}.json`
    let oldObj = state.stdArr.find(s=> s.id === state.stdedit_id)
    let updatedObj={
        fname : fname.value,
        lname : lname.value,
        subject : subject.value,
        id : updateId
    }
    handleSpinner(true)
    makeApiCall(updateURl,"PATCH",updatedObj)
     .then(res =>{
        let getIndex = state.stdArr.findIndex(s=>s.id === updateId)
        state.stdedit_id = null;
        state.stdArr[getIndex] = updatedObj

        templiting(state.stdArr)

        updatebtn.classList.add('d-none')
        addbtn.classList.remove('d-none')
        stdform.reset()

        snackBar('updated successfully!!!','success')
     })
     .catch(err=>{
        snackBar(err,'error')
     })
     .finally(()=>{
        handleSpinner()
     })
}



stdform.addEventListener('submit',onAddstd)
updatebtn.addEventListener('click',onupdate)
