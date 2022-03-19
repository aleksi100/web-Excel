let current
const cellStyles = 'cell placeholder:text-black bg-gray-200 border-black border h-8 w-20 '
const Letters = ' ABCDEFGHIJKLMNOPQRSTU'
let Cells = {}

let isChoice = false

function giveValue(value, c){
  let number = ''
  let n=c
  let x = Letters.indexOf(value[n])
  n++
  while(value[n]!=='}' && n<value.length){
    number += value[n]
    n++ 
  }
  let newValue
  let ce = Cells[x+':'+number]
  console.log('x,y',x, number)
  if(ce.result){newValue=ce.result}else{newValue=ce.value}
  let skip = n-c
  return [newValue, skip]
}
function parse(value){
    
    if(value[0]==='='){
      value = value.toUpperCase()
      //finding links to other cells
      let newValue = ''
      for(c=0;c<value.length;c++){
        
        if(value[c]==='{'){
          c+=1
          let [rep, ind] = giveValue(value, c)
          newValue += rep
          c+=ind
        }else{
          newValue += value[c]
        }
      }
      newValue[0]=''
      console.log(newValue)
      try{
        let result = Formula.calc(newValue)
        console.log(result)
        return result
      }catch{
        return 'Error'
      }
    }

}
class CELL{
  constructor(x, y){
    this.x = x
    this.y = y
    //what is typed in cell
    this.value = ''
    
    //what is displayed to cell
    this.result = null


    //the input element
    this.target
  }

  focus(value){
    value.target.value = this.value
    this.target = value.target
  }
  blur(value){
    this.value = value.target.value

    // update every cell
    for(y=0;y<25;y++){
      for(x=0;x<20;x++){
        if(x!==0 && y!==0){
          Cells[x+':'+y].update()

        }
      }
    }
  }
  update(){
    let result = parse(this.value)
    if(result){
      if(result === 'Error'){
        this.target.style.color = 'red'
      }else{
        this.target.style.color = 'black'
        this.result = result
      }
      this.target.value = result
    }

  }
}

function make_cells(y, x){
  let cell;
  if(y===0){
    cell = document.createElement('h3') 
    cell.textContent = Letters[x]
  }else if(x===0){
    cell = document.createElement('h3') 
    cell.textContent = y

  }else{
    cell = document.createElement('input')
    cell.id = x+':'+y
    cell_class = new CELL(x, y) 
    Cells[x+':'+y] = cell_class

    document.addEventListener('keypress', (key)=>{
      if(key.keyCode===13){
        isChoice = false
        current.blur()
      }
    })
    
    cell.addEventListener('click', (value)=>{
      if(isChoice){
        value.target.blur()
        current.value += '{' + Letters[x] + y + '}'
        console.log('clicked', value)
      }
    })
    cell.addEventListener('blur', (value)=>{
      if(!isChoice){
        Cells[x+':'+y].blur(value)
      }

    })
    
    cell.addEventListener('input', (value)=>{
      if(value.target.value[0] === '='){
        isChoice=true
      }else{
        isChoice=false
      }
    })
    cell.addEventListener('focus', (value)=>{
      if(!isChoice){

        current = value.target
        Cells[x+':'+y].focus(value)
      }else{
        current.focus()
      }

    })
  }
  const main = document.getElementById('main')
   
  cell.className = cellStyles
  cell.style.top = (2*y).toString()+'rem'
  cell.style.left = (5*x).toString()+'rem'
  main.appendChild(cell)
}
for(y=0;y<25;y++){
  for(x=0;x<20;x++){

  make_cells(y, x)
  }
}