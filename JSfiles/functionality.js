//Importing modules
const fs = require('fs');
const {dialog} = require('electron').remote
const CProcess = require('child_process');

//Select from HTML
let SelectFormatYes = document.getElementById('yes') //Select Format // returns boolean
let formatCode = document.getElementById('formatCode') //Input to insert format Code
let myFile = document.getElementById('myFile') //Select File

let statusFile = document.getElementById('statusDownloading') //Status of process
let outputMyResult = document.getElementById('downloadingInfo')//Console.log Downloading process

let startDownload = document.getElementById('startDownload') //Start Button 
let ListOfUrls; //List of Urls

//This Code only works when you start for the first time with Npm start if you save/change while running it wont work
//Events
// Creating button that opens file window
myFile.addEventListener('click', async ()=>{
  statusFile.style.color = 'white'
  statusFile.innerText = 'Selecting new File'
  let file;
  try{ 
    let options = {
        defaultPath:`D:\\DwN\\LINKS`,
        filters:[ {name:"textFiles", extensions:['txt']} ]
    }
    //Open Select File Window
    let getFile = await dialog.showOpenDialog(options)
        file = await getFile.filePaths[0]
        console.log(file);
  }catch(err){console.log(err)}

  //After using file select system
  if(file === undefined){ //Check if file is selected || when click cansel button do this..
    statusFile.innerText = 'File not selected'
    ListOfUrls = undefined
    console.log("File not selected");
  }else{
  //Read the file and store in a variable
    statusFile.innerText = `Selected File: ${file.toString()} `
    statusFile.style.color = 'white'
    fs.readFile(file.toString(), 'utf8', (err, data)=>{
      ListOfUrls = data
    })
  }
}, false)

//+++++ EventListerner when Start button Clicked
startDownload.addEventListener('click', ()=>{
  let options = {cwd:'../../DwN', shell:true}
  let youtubeCommand = 'youtube-dl.exe --console-title'
  let youtubeSFormat = 'youtube-dl.exe --newline -F'
  let formatNr = formatCode.value
  let youtubeWithFormat = `youtube-dl.exe --newline -f ${formatNr}`

  if(ListOfUrls === undefined){
    statusFile.innerText = "File not found try again"
    statusFile.style.color = 'red'
    console.log("file not found when button start clicked");
  }else{
    //Do this if the user want to select format
    if(SelectFormatYes.checked){ 
      formatCode.style.display = 'block'

      //++++++++ Run this Command when the user inserts Format Number
      if(formatNr){
        let runCommand = CProcess.spawn(youtubeWithFormat, [ListOfUrls], options)
        //Show Output
        runCommand.stdout.on('data', (data) => {
          statusFile.style.color = 'rgba(219, 219, 3, 0.815)' 
          statusFile.innerText = 'Downloading...'
          outputMyResult.innerText = data
        
          console.log(data.toString());
        });
        //Show Error
        runCommand.stderr.on('data', (error) => {
          statusFile.innerText = error
          console.error(error.toString());
        });
        //Show After Download Complete
        runCommand.on('close', (code) => {
          statusFile.style.color = 'rgb(10, 255, 10)' 
          statusFile.innerText = 'Finish dowloading!'
          formatCode.style.display = 'none'
          formatCode.value = false
          ListOfUrls = undefined
          console.log(`Command Finished!! : ${code}`);
        });

      //++++++++ Run this Command if the user asking to show the formats Number
      }else{
        let runCommand = CProcess.spawn(youtubeSFormat, [ListOfUrls], options)
        //Show Output
        runCommand.stdout.on('data', (data) => {
          statusFile.style.color = 'rgba(219, 219, 3, 0.815)' 
          statusFile.innerText = 'Downloading...'
          outputMyResult.innerText = data
        
          console.log(data.toString());
        });
        //Show Error
        runCommand.stderr.on('data', (error) => {
          statusFile.innerText = error
          console.error(error.toString());
        });
        //Show After Download Complete
        runCommand.on('close', (code) => {
          statusFile.style.color = 'rgb(10, 255, 10)' 
          statusFile.innerText = 'Finish dowloading!'
          console.log(`Command Finished!! : ${code}`);

        });
      }
    }else{ //+++++++ Do this if the user dont select format
      statusFile.innerText = "Starting Downloading"
      statusFile.className = 'startingDownload'
      formatCode.style.display = 'none'
      //Configuring the Command
      let runCommand = CProcess.spawn(youtubeCommand, [ListOfUrls], options)
      //Show Output
      runCommand.stdout.on('data', (data) => {
        statusFile.style.color = 'rgba(219, 219, 3, 0.815)' 
        statusFile.innerText = 'Downloading...'
        outputMyResult.innerText = data
      
        console.log(data.toString());
      });
      //Show Error
      runCommand.stderr.on('data', (error) => {
        statusFile.innerText = error
        console.error(error.toString());
      });
      //Show After Download Complete
      runCommand.on('close', (code) => {
        statusFile.style.color = 'rgb(10, 255, 10)' 
        statusFile.innerText = 'Finish dowloading!'
        console.log(`Command Finished!! : ${code}`);
        ListOfUrls = undefined
      });
    }
  }
  
})