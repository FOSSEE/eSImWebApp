



globalVariable=0; 


var webtronics={
  circuit:null,
  copy:null,
  rightclickmenu:null,
  title:null,
  description:null,
  file_id:null,
  scopestatus:null,
  scopedata:null,

  tabs:[],
  mode:'',
  
  Vlist:/\s*expression|\s*url|.*script/,
  Alist:/^(x|y|x1|y1|x2|y2|dx|dy|cx|cy|r|width|height|transform|d|id|class|fill|stroke|visibility|stroke-width|xmlns|xmlns:wtx|connects|partvalue|flippable|spice|index|font-size|font-weight|font-style|font-family)$/,
  Elist:/^(path|circle|rect|line|text|g|tspan|svg|wtx:eval1|wtx:eval2|wtx:eval3|wtx:eval4|wtx:eval5|wtx:eval6|wtx:pwlval1|wtx:pwlval2|wtx:pwlval3|wtx:pwlval4|wtx:pwlval5|wtx:pwlval6|wtx:pwlval7|wtx:pwlval8|wtx:pulval1|wtx:pulval2|wtx:pulval3|wtx:pulval4|wtx:pulval5|wtx:pulval6|wtx:pulval7|wtx:amplitude|wtx:phase|wtx:offsetvoltage|wtx:voltageamplitude|wtx:frequency|wtx:delaytime|wtx:dampingfactor|wtx:part|wtx:pins|wtx:analog|wtx:digital|wtx:node|wtx:id|wtx:type|wtx:name|wtx:category|wtx:value|wtx:label|wtx:spice|wtx:flip|wtx:model|wtx:measure|metadata|)$/,
  /* .lib files contain spice .model devices .mod devices contain .subckt devices and the id must begin with x*/
//	serverurls:["http://logical.github.io/webtronix/webtronix_server"],
 	serverurls:["webtronix_server"],
  partslists:[],
  models:{},
  docfromtext:function(txt){
    var xmlDoc;
    if (window.DOMParser){
      parser=new DOMParser();
      xmlDoc=parser.parseFromString(txt,"text/xml");
      
    }
    else{ // Internet Explorer
      xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async="false";
      xmlDoc.loadXML(txt);
    } 
    return xmlDoc;
  },
  
  
  setsize:function(){
    var buffer=30;
    var realheight=window.innerHeight-$('webtronics_toolbar').offsetHeight-$('webtronics_footer').offsetHeight;
    var realwidth=window.innerWidth-$('webtronics_side_bar').offsetWidth;
    $('webtronics_center').style.width = window.offsetWidth+'px';
    $('webtronics_center').style.height = realheight-buffer+'px';
    $('webtronics_diagram_area').style.width = realwidth-buffer+'px';
    $('webtronics_diagram_area').style.height = realheight-buffer+'px';
    frames=$$('#webtronics_diagram_area>iframe')
    if(frames[0])frames[0].width = realwidth-buffer+'px';
    $('webtronics_side_bar').style.height=realheight-buffer+'px';
  },
  
  
  
  setMode:function(mode, status){


    //$('webtronics_status_bar').innerHTML = 'Mode: '+status;
    $('webtronics_add_text').style.display='none';
    if(mode=='select'){
      if($('webtronics_context_menu'))$('webtronics_context_menu').style.display='block';
    }
    else if(mode=='line'){
      if($('webtronics_context_menu'))$('webtronics_context_menu').style.display='none';
      if(this.circuit.selected){
       this.circuit.unselect();
     }
   }
   else if(mode=='text'){
    if($('webtronics_context_menu'))$('webtronics_context_menu').style.display='none';
  }
  $('webtronics_context_menu').style.display='none';
  this.circuit.mode=mode;

},


getvalues:function(elem){


  $("webtronics_part_model").options.length=0;
  $("webtronics_part_dir_model").options.length=0;
  $("webtronics_part_model").appendChild(new Element("option",{"value":""}).update("none"));
  $("webtronics_part_dir_model").appendChild(new Element("option",{"value":""}).update("none"));
  var part=netlistcreator.readwtx(elem,"name");
  var cat=netlistcreator.readwtx(elem,"category");
  if(cat && (part != "model")){
   for(var i=0;i<webtronics.partslists.length;i++){
    if(webtronics.partslists[i].parts[cat][part].values!=undefined){
      for(var model in webtronics.partslists[i].parts[cat][part].values){
       console.log("model");
       $("webtronics_part_model").insert(new Element("option",{"value":model}).update(model));
     }
     if(JSON.stringify(list).indexOf(part)!=-1){
      $("webtronics_part_help").innerHTML=webtronics.partslists[i].parts[cat][part].help;
    }
  }
}
}
},

center:function(e){

  e.style.left = ($('webtronics_main_window').offsetWidth/2)-(e.offsetWidth/2)+'px';
  e.style.top = ($('webtronics_main_window').offsetHeight/2)-(e.offsetHeight/2)+'px';
},

disablepage:function(){
  $("webtronics_disable").style.display="block";
},
enablepage:function(){
  $("webtronics_disable").style.display="none";
},

returnchip:function(){
  if($('webtronics_chip_display').getElementsByTagName('g').length){
    this.circuit.getgroup($('webtronics_chip_display').getElementsByTagName('g')[0]);
    netlistcreator.writewtx(this.circuit.selected[0],"id",this.circuit.getnextid(this.circuit.selected[0],0));
    this.circuit.createvalue(this.circuit.selected[0]);
  }
  $('webtronics_chips_box').style.display='none';
  this.setMode('select','Selection');
},

openProperties:function(){
  document.forms['webtronics_properties_form'].reset();
  var c=netlistcreator.readwtx(this.circuit.selected[0],"name");

  if(!c){
    netlistcreator.writewtx(this.circuit.selected[0],"name","ic");
  }
  if(c=="ac"){
    this.getvalues(this.circuit.selected[0]);
    $("webtronics_amplitude").style.display='block'
    $("webtronics_phase").style.display='block'

    var amplitude=netlistcreator.readwtx(this.circuit.selected[0],"amplitude");
    var phase=netlistcreator.readwtx(this.circuit.selected[0],"phase");

    if(amplitude!=""){
      $('webtronics_amplitude_value').value=amplitude;
        //jQuery("#webtronics_amplitude_value").val()=amplitude;      
      }

      if(phase!=""){$('webtronics_phase_value').value=phase;}


      $("webtronics_eval1").style.display='none'
      $("webtronics_eval2").style.display='none'
      $("webtronics_eval3").style.display='none'
      $("webtronics_eval4").style.display='none'
      $("webtronics_eval5").style.display='none'
      $("webtronics_eval6").style.display='none'


      $("webtronics_pwlval1").style.display='none'
      $("webtronics_pwlval2").style.display='none'
      $("webtronics_pwlval3").style.display='none'
      $("webtronics_pwlval4").style.display='none'
      $("webtronics_pwlval5").style.display='none'
      $("webtronics_pwlval6").style.display='none'
      $("webtronics_pwlval7").style.display='none'
      $("webtronics_pwlval8").style.display='none'


      $("webtronics_offsetvoltage").style.display='none'
      $("webtronics_frequency").style.display='none'
      $("webtronics_voltageamplitude").style.display='none'
      $("webtronics_delaytime").style.display='none'
      $("webtronics_dampingfactor").style.display='none'
      $("directive").style.display='none'


      $("webtronics_pulval1").style.display='none'
      $("webtronics_pulval2").style.display='none'
      $("webtronics_pulval3").style.display='none'
      $("webtronics_pulval4").style.display='none'
      $("webtronics_pulval5").style.display='none'
      $("webtronics_pulval6").style.display='none'
      $("webtronics_pulval7").style.display='none'


      $("valuemodel").style.display='none'

      $("webtronics_print_dir_field").style.display='block'
      $("webtronics_print_dir_value").value=netlistcreator.readwtx(this.circuit.selected[0],'measure');
    }



    else if(c=="sinvoltagesource"){
     $("webtronics_amplitude").style.display='none'
     $("webtronics_phase").style.display='none'


     $("webtronics_eval1").style.display='none'
     $("webtronics_eval2").style.display='none'
     $("webtronics_eval3").style.display='none'
     $("webtronics_eval4").style.display='none'
     $("webtronics_eval5").style.display='none'
     $("webtronics_eval6").style.display='none'


     $("webtronics_offsetvoltage").style.display='block'
     $("webtronics_frequency").style.display='block'
     $("webtronics_voltageamplitude").style.display='block'
     $("webtronics_delaytime").style.display='block'
     $("webtronics_dampingfactor").style.display='block'    
     $("directive").style.display='none'


     $("webtronics_pwlval1").style.display='none'
     $("webtronics_pwlval2").style.display='none'
     $("webtronics_pwlval3").style.display='none'
     $("webtronics_pwlval4").style.display='none'
     $("webtronics_pwlval5").style.display='none'
     $("webtronics_pwlval6").style.display='none'
     $("webtronics_pwlval7").style.display='none'
     $("webtronics_pwlval8").style.display='none'


     $("webtronics_pulval1").style.display='none'
     $("webtronics_pulval2").style.display='none'
     $("webtronics_pulval3").style.display='none'
     $("webtronics_pulval4").style.display='none'
     $("webtronics_pulval5").style.display='none'
     $("webtronics_pulval6").style.display='none'
     $("webtronics_pulval7").style.display='none'


     var offsetvoltage=netlistcreator.readwtx(this.circuit.selected[0],"offsetvoltage");
     var voltageamplitude=netlistcreator.readwtx(this.circuit.selected[0],"voltageamplitude");
     var frequency=netlistcreator.readwtx(this.circuit.selected[0],"frequency");
     var delaytime=netlistcreator.readwtx(this.circuit.selected[0],"delaytime");
     var dampingfactor=netlistcreator.readwtx(this.circuit.selected[0],"dampingfactor");

     if(offsetvoltage!=""){$('webtronics_offsetvoltage_value').value=offsetvoltage;}
     if(voltageamplitude!=""){$('webtronics_voltageamplitude_value').value=voltageamplitude;}
     if(frequency!=""){$('webtronics_frequency_value').value=frequency;}
     if(delaytime!=""){$('webtronics_delaytime_value').value=delaytime;}
     if(dampingfactor!=""){$('webtronics_dampingfactor_value').value=dampingfactor;}


     $("valuemodel").style.display='none'
   }


   else if(c=="pulse"){
     $("webtronics_amplitude").style.display='none'
     $("webtronics_phase").style.display='none'

     $("webtronics_offsetvoltage").style.display='none'
     $("webtronics_frequency").style.display='none'
     $("webtronics_voltageamplitude").style.display='none'
     $("webtronics_delaytime").style.display='none'
     $("webtronics_dampingfactor").style.display='none'


     $("webtronics_eval1").style.display='none'
     $("webtronics_eval2").style.display='none'
     $("webtronics_eval3").style.display='none'
     $("webtronics_eval4").style.display='none'
     $("webtronics_eval5").style.display='none'
     $("webtronics_eval6").style.display='none'



     $("webtronics_pwlval1").style.display='none'
     $("webtronics_pwlval2").style.display='none'
     $("webtronics_pwlval3").style.display='none'
     $("webtronics_pwlval4").style.display='none'
     $("webtronics_pwlval5").style.display='none'
     $("webtronics_pwlval6").style.display='none'
     $("webtronics_pwlval7").style.display='none'
     $("webtronics_pwlval8").style.display='none'

     $("webtronics_pulval1").style.display='block'
     $("webtronics_pulval2").style.display='block'
     $("webtronics_pulval3").style.display='block'
     $("webtronics_pulval4").style.display='block'
     $("webtronics_pulval5").style.display='block'
     $("webtronics_pulval6").style.display='block'
     $("webtronics_pulval7").style.display='block'

     $("directive").style.display='none'
     var pulval1=netlistcreator.readwtx(this.circuit.selected[0],"pulval1");
     var pulval2=netlistcreator.readwtx(this.circuit.selected[0],"pulval2");
     var pulval3=netlistcreator.readwtx(this.circuit.selected[0],"pulval3");
     var pulval4=netlistcreator.readwtx(this.circuit.selected[0],"pulval4");
     var pulval5=netlistcreator.readwtx(this.circuit.selected[0],"pulval5");
     var pulval6=netlistcreator.readwtx(this.circuit.selected[0],"pulval6");
     var pulval7=netlistcreator.readwtx(this.circuit.selected[0],"pulval7");         
     if(pulval1!=""){$('webtronics_pulval1_value').value=pulval1;}
     if(pulval2!=""){$('webtronics_pulval2_value').value=pulval2;}
     if(pulval3!=""){$('webtronics_pulval3_value').value=pulval3;}
     if(pulval4!=""){$('webtronics_pulval4_value').value=pulval4;}
     if(pulval5!=""){$('webtronics_pulval5_value').value=pulval5;}
     if(pulval6!=""){$('webtronics_pulval6_value').value=pulval6;}
     if(pulval7!=""){$('webtronics_pulval7_value').value=pulval7;}

     $("valuemodel").style.display='none'
   }

   else if(c=="exponential"){
     $("webtronics_amplitude").style.display='none'
     $("webtronics_phase").style.display='none'

     $("webtronics_offsetvoltage").style.display='none'
     $("webtronics_frequency").style.display='none'
     $("webtronics_voltageamplitude").style.display='none'
     $("webtronics_delaytime").style.display='none'
     $("webtronics_dampingfactor").style.display='none'


     $("webtronics_pulval1").style.display='none'
     $("webtronics_pulval2").style.display='none'
     $("webtronics_pulval3").style.display='none'
     $("webtronics_pulval4").style.display='none'
     $("webtronics_pulval5").style.display='none'
     $("webtronics_pulval6").style.display='none'
     $("webtronics_pulval7").style.display='none'


     $("webtronics_pwlval1").style.display='none'
     $("webtronics_pwlval2").style.display='none'
     $("webtronics_pwlval3").style.display='none'
     $("webtronics_pwlval4").style.display='none'
     $("webtronics_pwlval5").style.display='none'
     $("webtronics_pwlval6").style.display='none'
     $("webtronics_pwlval7").style.display='none'
     $("webtronics_pwlval8").style.display='none'

     $("webtronics_eval1").style.display='block'
     $("webtronics_eval2").style.display='block'
     $("webtronics_eval3").style.display='block'
     $("webtronics_eval4").style.display='block'
     $("webtronics_eval5").style.display='block'
     $("webtronics_eval6").style.display='block'
     

     $("directive").style.display='none'
     var eval1=netlistcreator.readwtx(this.circuit.selected[0],"eval1");
     var eval2=netlistcreator.readwtx(this.circuit.selected[0],"eval2");
     var eval4=netlistcreator.readwtx(this.circuit.selected[0],"eval4");
     var eval3=netlistcreator.readwtx(this.circuit.selected[0],"eval3");
     var eval5=netlistcreator.readwtx(this.circuit.selected[0],"eval5");
     var eval6=netlistcreator.readwtx(this.circuit.selected[0],"eval6");
     
     if(eval1!=""){$('webtronics_eval1_value').value=eval1;}
     if(eval2!=""){$('webtronics_eval2_value').value=eval2;}
     if(eval3!=""){$('webtronics_eval3_value').value=eval3;}
     if(eval4!=""){$('webtronics_eval4_value').value=eval4;}
     if(eval5!=""){$('webtronics_eval5_value').value=eval5;}
     if(eval6!=""){$('webtronics_eval6_value').value=eval6;}
     

     $("valuemodel").style.display='none'
   }




   else if(c=="pwl"){
     $("webtronics_amplitude").style.display='none'
     $("webtronics_phase").style.display='none'

     $("webtronics_offsetvoltage").style.display='none'
     $("webtronics_frequency").style.display='none'
     $("webtronics_voltageamplitude").style.display='none'
     $("webtronics_delaytime").style.display='none'
     $("webtronics_dampingfactor").style.display='none'



     $("webtronics_eval1").style.display='none'
     $("webtronics_eval2").style.display='none'
     $("webtronics_eval3").style.display='none'
     $("webtronics_eval4").style.display='none'
     $("webtronics_eval5").style.display='none'
     $("webtronics_eval6").style.display='none'

     $("webtronics_pulval1").style.display='none'
     $("webtronics_pulval2").style.display='none'
     $("webtronics_pulval3").style.display='none'
     $("webtronics_pulval4").style.display='none'
     $("webtronics_pulval5").style.display='none'
     $("webtronics_pulval6").style.display='none'
     $("webtronics_pulval7").style.display='none'


     $("webtronics_pwlval1").style.display='block'
     $("webtronics_pwlval2").style.display='block'
     $("webtronics_pwlval3").style.display='block'
     $("webtronics_pwlval4").style.display='block'
     $("webtronics_pwlval5").style.display='block'
     $("webtronics_pwlval6").style.display='block'
     $("webtronics_pwlval7").style.display='block'
     $("webtronics_pwlval8").style.display='block'

     $("directive").style.display='none'
     var pwlval1=netlistcreator.readwtx(this.circuit.selected[0],"pwlval1");
     var pwlval2=netlistcreator.readwtx(this.circuit.selected[0],"pwlval2");
     var pwlval3=netlistcreator.readwtx(this.circuit.selected[0],"pwlval3");
     var pwlval4=netlistcreator.readwtx(this.circuit.selected[0],"pwlval4");
     var pwlval5=netlistcreator.readwtx(this.circuit.selected[0],"pwlval5");
     var pwlval6=netlistcreator.readwtx(this.circuit.selected[0],"pwlval6");
     var pwlval7=netlistcreator.readwtx(this.circuit.selected[0],"pwlval7");
     var pwlval8=netlistcreator.readwtx(this.circuit.selected[0],"pwlval8");         
     if(pwlval1!=""){$('webtronics_pwlval1_value').value=pwlval1;}
     if(pwlval2!=""){$('webtronics_pwlval2_value').value=pwlval2;}
     if(pwlval3!=""){$('webtronics_pwlval3_value').value=pwlval3;}
     if(pwlval4!=""){$('webtronics_pwlval4_value').value=pwlval4;}
     if(pwlval5!=""){$('webtronics_pwlval5_value').value=pwlval5;}
     if(pwlval6!=""){$('webtronics_pwlval6_value').value=pwlval6;}
     if(pwlval7!=""){$('webtronics_pwlval7_value').value=pwlval7;}
     if(pwlval8!=""){$('webtronics_pwlval7_value').value=pwlval8;}

     $("valuemodel").style.display='none'
   }






   else if(c=="scope"){
    this.getvalues(this.circuit.selected[0]);
    $("webtronics_print_dir_field").style.display='block'
    $("webtronics_print_dir_value").value=netlistcreator.readwtx(this.circuit.selected[0],'measure');
    $("directive").style.display='none'

    $("webtronics_offsetvoltage").style.display='none'
    $("webtronics_frequency").style.display='none'
    $("webtronics_voltageamplitude").style.display='none'
    $("webtronics_delaytime").style.display='none'
    $("webtronics_dampingfactor").style.display='none'


    $("webtronics_eval1").style.display='none'
    $("webtronics_eval2").style.display='none'
    $("webtronics_eval3").style.display='none'
    $("webtronics_eval4").style.display='none'
    $("webtronics_eval5").style.display='none'
    $("webtronics_eval6").style.display='none'


    $("webtronics_pwlval1").style.display='none'
    $("webtronics_pwlval2").style.display='none'
    $("webtronics_pwlval3").style.display='none'
    $("webtronics_pwlval4").style.display='none'
    $("webtronics_pwlval5").style.display='none'
    $("webtronics_pwlval6").style.display='none'
    $("webtronics_pwlval7").style.display='none'
    $("webtronics_pwlval8").style.display='none'

    $("webtronics_pulval1").style.display='none'
    $("webtronics_pulval2").style.display='none'
    $("webtronics_pulval3").style.display='none'
    $("webtronics_pulval4").style.display='none'
    $("webtronics_pulval5").style.display='none'
    $("webtronics_pulval6").style.display='none'
    $("webtronics_pulval7").style.display='none'

    $("webtronics_amplitude").style.display='none'
    $("webtronics_phase").style.display='none'
  }
  else {
    this.getvalues(this.circuit.selected[0]);
    $("directive").style.display='none'

    $("webtronics_offsetvoltage").style.display='none'
    $("webtronics_frequency").style.display='none'
    $("webtronics_voltageamplitude").style.display='none'
    $("webtronics_delaytime").style.display='none'
    $("webtronics_dampingfactor").style.display='none'
    $("valuemodel").style.display='block'

    $("webtronics_amplitude").style.display='none'
    $("webtronics_phase").style.display='none'


    $("webtronics_eval1").style.display='none'
    $("webtronics_eval2").style.display='none'
    $("webtronics_eval3").style.display='none'
    $("webtronics_eval4").style.display='none'
    $("webtronics_eval5").style.display='none'
    $("webtronics_eval6").style.display='none'


    $("webtronics_pwlval1").style.display='none'
    $("webtronics_pwlval2").style.display='none'
    $("webtronics_pwlval3").style.display='none'
    $("webtronics_pwlval4").style.display='none'
    $("webtronics_pwlval5").style.display='none'
    $("webtronics_pwlval6").style.display='none'
    $("webtronics_pwlval7").style.display='none'
    $("webtronics_pwlval8").style.display='none'


    $("webtronics_pulval1").style.display='none'
    $("webtronics_pulval2").style.display='none'
    $("webtronics_pulval3").style.display='none'
    $("webtronics_pulval4").style.display='none'
    $("webtronics_pulval5").style.display='none'
    $("webtronics_pulval6").style.display='none'
    $("webtronics_pulval7").style.display='none'
    var value=netlistcreator.readwtx(this.circuit.selected[0],"value");
    if(value!=""){$('webtronics_part_value').value=value;}
  }

  if(c=="diode")$("directive").style.display='block'
    var id=netlistcreator.readwtx(this.circuit.selected[0],"id");

  
  if(id!=""){$('webtronics_part_id').value=id;}

  $("webtronics_part_dir_value").value=netlistcreator.readwtx(this.circuit.selected[0],'model');

  if(!netlistcreator.readwtx(webtronics.circuit.selected[0],"value")){
    $('webtronics_part_id').value=this.circuit.getnextid(this.circuit.selected[0],0);
  }

  this.disablepage();
  $('webtronics_properties_div').style.display = "block";

},

sanitize:function(xmldoc){
  var elems=xmldoc.getElementsByTagName('*');
  for(var i=0;i<elems.length;i++){
    if(!elems[i].tagName.match(this.Elist))return elems[i].tagName;
    var attr=elems[i].attributes;
    for(var j=0;j<attr.length;j++){
     if(!attr[j].name.match(this.Alist))return attr[j].name;
     if(attr[j].value.match(this.Vlist))return attr[j].value;
   } 
 }
},
createfilemenu:function(x,y,id,parent,list){
  var menu=document.createElement('div');
  menu.id=id;
  menu.className='webtronics_menu';
  menu.style.left=x+'px';
  menu.style.top=y+'px';
  for(var i=0;i<list.length;i++){
    var item=new Element('a',{Title:list[i].label,id:'webtronics_context_option',class:'enabled'})
    .observe('click',list[i].cb.bind(this))
    .observe('contextmenu', Event.stop)
    .update(list[i].label);
    menu.insert(item);
    menu.insert(new Element('br'));
  }
  menu.observe('click',Event.stop)
  .observe('contextmenu',Event.stop);
  menu.style.display='none';
  return menu;			

},

file_open:function(){
  var file=new Element('input',{'type':'file'});
  var div=new Element('div',{'class':'modal'}).insert(file);
  Event.observe(file,'change',function(){
    if(window.FileReader){
     var textReader = new FileReader();
     textReader.onloadend=function(){
       if(!textReader.result){
         console.log("error opening file");
         return;
       };

       var xmlDoc=this.docfromtext(textReader.result);
       if(!xmlDoc){alert("error parsing svg");}
       else{
         var result=this.sanitize(xmlDoc)
         if(result){console.log(result+ ' found');alert('unclean file');return;}
         var node=xmlDoc.getElementsByTagName('svg')[0];
         if(!node){alert("svg node not found")}
           else this.circuit.getfile(node);
       }
     }.bind(this);
     textReader.readAsText(file.files[0]);
     $('webtronics_main_window').removeChild(div);
   }
 }.bind(this));
  $('webtronics_main_window').insert(div);
  div.style.display='block';
  file.focus();
  file.click();
  $('webtronics_file_menu').style.display='none';
  div.style.display='none';

},

download:function(filename, data) {
 var pom = document.createElement('a');
 pom.setAttribute('href', data);
 pom.setAttribute('download', filename);
 document.body.appendChild(pom);
 pom.click();
 pom.parentNode.removeChild(pom);
},
saveuri:function(){
  var string="<?xml version='1.0' ?>\n";
  string+="<!--Created by webtronics 0.1-->\n";
  var doc=this.circuit.getDoc(true,false);
  string += (new XMLSerializer()).serializeToString(doc);
  this.download("webtronix.svg","data:application/octet-stream;charset=utf-8;base64," + encode64(string));

  $('webtronics_file_menu').style.display='none';

},




file_new:function(){
  $('webtronics_file_menu').style.display='none';
    //this.setMode('webtronics_select','select','Selection');
    input_box=confirm("Click OK to Clear the Drawing.");
    if (input_box==true){
      $('webtronics_diagram_area').removeChild($("webtronics_display_frame"));
      var frame=new Element('iframe',{id:'webtronics_display_frame',src:'canvas/canvas.html'});
      $('webtronics_diagram_area').insert(frame);
      Event.observe(frame,'load',function(){
       var filename='Schematic.svg';
       this.attachframe(filename,frame);

     }.bind(this));
      $("webtronics_showhelp").checked=false;
      $$(".webtronics_help").forEach(function(e){
       e.style.display="none";
     });
      $("webtronics_invert").checked=false;
      $("webtronics_graph").checked=false;
      $("webtronics_connections").checked=false;

    }
  },
  
  attachframe:function(filename,frame){
    this.circuit=frame.contentWindow.circuit;
    this.setMode('select', 'Selection');    
    //            this.circuit.mode=this.mode;
    
    /*attach the menu*/
    Event.observe(this.circuit.container,'contextmenu',function(e){
      $('webtronics_context_menu').style.top=Event.pointerY(e)+'px';                        
      $('webtronics_context_menu').style.left=Event.pointerX(e)+'px';                        
      if(this.circuit.mode =="select")$('webtronics_context_menu').style.display='block';                        
      if(this.circuit.selected.length===1&& this.circuit.selected[0].tagName==='g'){
       $$('div#webtronics_context_menu [title=Properties]')[0].className='enabled';
     }
     else {
       $$('div#webtronics_context_menu [title=Properties]')[0].className='disabled';
     }
     Event.stop(e);
   }.bind(this));
    Event.observe(this.circuit.container,'click',function(e){
      if(Event.isLeftClick(e)){                
       if($('webtronics_context_menu')){
         $('webtronics_context_menu').style.display='none';
       }
     }
   }.bind(this));
    
    
  },
  
  formatnetlist:function(spice1,spice2){
    var html=new Element('textarea');
    html.id="webtronics_netlist_text_area";
    html.cols=40;
    html.rows=15;
    html.value=spice1;
    return html;            
  },
  spicenetlist:"",
  gnucapjs:function(netlist){
    webtronics.spicenetlist=netlist;
    /*add a new frame */
    $('webtronics_scope_display_div').innerHTML='';
    $("webtronics_scope_output_graph").checked=true;
    $("webtronics_scope_status").innerHTML="DOWNLOADING GNUCAP";

    var frame=new Element('iframe',{id:'webtronics_scope_display_frame',src:'gnucapjs/gnucap.html',width:"100%",height:"100%"});
    $('webtronics_scope_display_div').insert(frame);
    $("webtronics_scope_display").style.display="block"
  },

  /*
   *         postspice:function(spice){
   *            var text;
   *			new Ajax.Request("spice.php",{
   *			method:'post',
   *			contentType:"text/plain",
   *			asynchronous:true,
   *			postBody:spice,
   *			onSuccess:function(transport){
   *                if($("webtronics_scope_display_image"))$("webtronics_scope_display_image").parentNode.removeChild($("webtronics_scope_display_image"));
   *                var content;
   *                if(transport.responseText.match("data:image/png;base64,")){                
   *                    var content=new Element("img",{"src":transport.responseText,"width":400,"height":400,"id":"webtronics_scope_display_image"});
}
else{
  var content=new Element("textarea",{"width":400,"height":400,"id":"webtronics_scope_display_image"}).update(transport.responseText);
}            
if(content){
  $("webtronics_scope_display").style.display="block";
  $("webtronics_scope_display_div").insert(content);
}
},			
onFailure: function(){ 
console.log('Could not retrieve file...'); 
},
onException: function(req,exception) {
console.log(exception);
} 
});

},
*/
savepng:function(){
/*   
    if(navigator.appName == 'Microsoft Internet Explorer'){
      $('webtronics_image_div').innerHTML="<img id='webtronics_image_save' >";
    }
    */
    if(this.circuit.drawing.getAttribute('class')==="inv"){
      var doc=this.circuit.getDoc(true,true);
    }
    else{
      var doc=this.circuit.getDoc(true,false);
    }
    var svgsize=this.circuit.svgSize();
    var canvas=new Element('canvas',{'id':'webtronics_canvas','width':svgsize.width-svgsize.x+20+'px','height':svgsize.height-svgsize.y+20+'px',style:"display:none"});
    document.body.insert(canvas);
    var ctx=$("webtronics_canvas").getContext("2d");

    ctx.drawSvg(doc, 0, 0, svgsize.width-svgsize.x+20,svgsize.height-svgsize.y+20);    
    var url= canvas.toDataURL("application/octet-stream");
    this.download("webtronix.png",url);
    canvas.parentNode.removeChild(canvas);		
  },
  addpart:function(url,cat,partname) {
    var listfile=function(partsvg){
      var part=new Element("div",{"id":"webtronics_"+partname,"class":"webtronics_menu_part",'style':"display:none",'title':partname})
      .update(partsvg);
      $("webtronics_"+cat).insert(part);
      Event.observe(part,'mousedown',function(e){
        var group=$$( "#"+ part.id+" g" )[0];
        webtronics.circuit.getgroup(group);
        webtronics.setMode('select','Selection');
      });
      Event.observe(part,'mouseup',function(e){
       webtronics.circuit.deleteSelection();				
     });


    }

    if(url.indexOf("http://")==-1){
     openfile(url+'/'+cat+'/'+partname+'.svg',listfile);

   }
   else{
     new request(url,cat+"/"+partname+'.svg',listfile);

   }

 },


//this takes an objectand returns a menu element
makemenu:function(url, partlist,menu){


  for (var cat in partlist.parts){
   if(!$("webtronics_"+cat)){
    var category=new Element("div",{"id":"webtronics_"+cat})
    .insert(new Element("p").update(cat)
     .observe('click',function(e){

      var menuitems=$$('#'+menu.id+'>div>div');

      for(var i=0;i<menuitems.length;i++){
       if(menuitems[i].parentNode==Event.element(e).parentNode){
         if(menuitems[i].style.display=='none'){
           menuitems[i].style.display='block';
         }
         else{
           menuitems[i].style.display='none';
         }
       }
       else{
         menuitems[i].style.display='none';
       }
     }
   }));
    menu.insertBefore(category,menu.firstChild);

    for(var partname in partlist.parts[cat]){
     if(!$("webtronics_"+partname)){
      webtronics.addpart(url , cat,partname);

    }
							//if(partlist.parts[cat][partname].indexOf()<0){}
            }                

          }

        }
      },
      populatemenu:function(){
        /*asynchronous part loading */
        $("webtronics_parts_list").innerHTML="";
        webtronics.serverurls.each(function(url){
         if(url=="webtronix_server"){
          openfile(url+"/parts.json",function(text){
           webtronics.partslists.push(text.evalJSON(true));
           webtronics.partslists[webtronics.partslists.length-1].url=url;
           webtronics.makemenu(url,webtronics.partslists[webtronics.partslists.length-1] , $("webtronics_parts_list"));
         });

        }
        else{
          new request(url,"parts.json",function(text){
           webtronics.partslists.push(text.evalJSON(true));
           webtronics.partslists[webtronics.partslists.length-1].url=url;
           webtronics.makemenu(url,webtronics.partslists[webtronics.partslists.length-1] , $("webtronics_parts_list"));
         });

        }
      }.bind(this));


      },

      opensources:function(){
        var sources=$$(".webtronics_add_source_input");
        for( var i=0;i<sources.length;i++){
         if(webtronics.serverurls[i])sources[i].value=webtronics.serverurls[i];
         else sources[i].value="";
       }
       $("webtronics_add source").style.display="block";
       this.center($("webtronics_add source"));
       this.disablepage();
     },

     /*all events are loaded here*/
     init:function(){
      Event.observe(window, 'load', function(){
        if (!window.console) {
         window.console = {};
         window.console.log = function(){};
       }

       webtronics.setsize();
      //	    $('webtronics_scope_display_iframe').src="";
      var menu;
      $("webtronics_showhelp").checked=false;
      $("webtronics_invert").checked=false;
      $("webtronics_graph").checked=false;
      $("webtronics_connections").checked=false;
      
      menu=this.createfilemenu($('webtronics_file').offsetLeft,
        $('webtronics_file').offsetTop+$('webtronics_file').offsetHeight,
        'webtronics_file_menu',
        $('webtronics_main_window'),
        [{label:'sources',cb:webtronics.opensources},
        {label:'import',cb:webtronics.file_open},
        {label:'save',cb:webtronics.saveuri},
        {label:'kicad',cb:wtx2kicad},
        {label:'save-png',cb:webtronics.savepng},
        {label:'new',cb:webtronics.file_new}]);
      menu.observe('mouseout',function(e){
       if((e.relatedTarget!=null)&&!((e.relatedTarget == menu) || e.relatedTarget.descendantOf(menu))){
	  //                if(!(e.relatedTarget == menu) ){
     menu.style.display='none';
   }
 });    
      
      $("webtronics_main_window").insertBefore(menu,$("webtronics_disable"));
      
      
      /*replace context menu*/
      var myLinks = [
      {label:'copy',cb:function(){
       webtronics.copy=webtronics.circuit.copy();
       $('webtronics_context_menu').style.display='none';
     }},
     {label:'paste',cb:function(){
       webtronics.circuit.paste(webtronics.copy);
       $('webtronics_context_menu').style.display='none';}},

       {label:'delete',cb:function(){
        webtronics.circuit.deleteSelection();
        $('webtronics_context_menu').style.display='none';}},

        {label:'Properties',cb:function(){
          webtronics.openProperties()
          webtronics.center($('webtronics_properties_div'));
          document.forms['webtronics_properties_form'].focus();
          $('webtronics_context_menu').style.display='none';


        }}];
        var contextmenu=this.createfilemenu(0,
          0,
          'webtronics_context_menu',
          $('webtronics_diagram_area'),
          myLinks);
        $("webtronics_diagram_area").insert(contextmenu);
        /*add a new frame */
        var frame=new Element('iframe',{id:'webtronics_display_frame',src:'canvas/canvas.html'});
        $('webtronics_diagram_area').insert(frame);

        Event.observe(frame,'load',function(){
          var filename='Schematic.svg';
          this.attachframe(filename,frame);
        }.bind(this));

        Event.observe(window, 'resize', function() {
          webtronics.setsize();
          webtronics.circuit.addtools();	
        });

        $('webtronics_toolbar').onselectstart = function() {return false;} 

        $('webtronics_diagram_area').onselectstart = function() {return false;} 
        $('webtronics_side_bar').onselectstart = function() {return false;} 


//populate default menu

webtronics.populatemenu();



    			


/*chipmaker*/
$("webtronics_hor_pins").insert(Element("option",{"value":0}).update(0));
for(var i=1;i<50;i++){
  if(i>3){
    $("webtronics_hor_pins").insert(Element("option",{"value":i}).update(i*2));
  }
  $("webtronics_vert_pins").insert(Element("option",{"value":i}).update(i*2));

}

/*menu events*/		

Event.observe($('webtronics_file'), 'click', function() {
  if($('webtronics_file_menu').style.display=='block'){
    $('webtronics_file_menu').style.display='none';
  }            
  else {
    $('webtronics_file_menu').style.display='block';
  }                
});
Event.observe($('webtronics_chips_open'), 'click', function() {
  webtronics.circuit.clearinfo();
  webtronics.setMode('select','Selection');
  chipmaker.openmaker();
  $('webtronics_chips_box').style.display = "block";
  webtronics.center($('webtronics_chips_box'));
  webtronics.disablepage();
});
if($("webtronics_select"))Event.observe($('webtronics_select'), 'click', function() {
  webtronics.circuit.clearinfo();
  webtronics.setMode('select', 'Selection');
});
  if($("webtronics_wire"))Event.observe($('webtronics_wire'), 'click', function() {
    webtronics.circuit.clearinfo();
    webtronics.setMode('line','Wire');
  });
    Event.observe($('webtronics_text'), 'click', function() {
      webtronics.circuit.clearinfo();
      if($('webtronics_text').className=='pressed_button'){
        $('webtronics_text').className = 'normal_button';
        webtronics.setMode('select', 'Selection');
      }
      else {
        $('webtronics_text').className = 'pressed_button';
        webtronics.setMode('text', 'Text');
      }

    });
    if($('webtronics_undo')){
      Event.observe($('webtronics_undo'),'click',function(){
        webtronics.circuit.undo();

      });
    }
    if($('webtronics_redo')){
      Event.observe($('webtronics_redo'),'click',function(){
        webtronics.circuit.redo();
      });
    }

    Event.observe($('webtronics_delete'), 'click', function() {
      webtronics.circuit.clearinfo();
      webtronics.circuit.addhistory();
      webtronics.circuit.deleteSelection();
    });
/*
		  if($('webtronics_save')){
 		    Event.observe($('webtronics_save'), 'click', function() {
		      webtronics.circuit.clearinfo();
		      webtronics.showMarkup();
		    });
		  }
      */

      flag1=0;



      jQuery("#analysis_selectbox").change(function(){

        analysis_type = jQuery(this).val();

      });
      




      if($('webtronics_netlist')){
        Event.observe($('webtronics_netlist'), 'click', function() {
          if(flag1!=0){

            netlistcreator.createnetlist(function(netlist){
             var content=$$("#webtronics_netlist_text_div > *") 
             for(var i=0;i<content.length;i++){
               $("webtronics_netlist_text_div").removeChild(content[i]);
             }
             $("webtronics_netlist_text_div").insert(webtronics.formatnetlist(netlist,null));
             $("webtronics_netlist_text").style.display='block';
             globalVariable=1;
             webtronics.center($('webtronics_netlist_text_div'));
             webtronics.disablepage();});




            jQuery('#webtronics_netlist_buttons').show();





            change_val = "0";
            Flag = "";
  //console.log("out")


  if (change_val == "0")
  {
    Flag = jQuery("#webtronics_netlist_text_area").val();
    

/*------------------------------------------------------------------------------------------------------------------------------------- 
 Here are the conditions concatenated to give final netlist values for dc all cases  
 ---------------------------------------------------------------------------------------------------------------------------------------------*/ 
 if (analysis_type == "1") 
 { 

  console.log(jQuery("#analysis_selectbox").val());

  jQuery("#webtronics_netlist_text_area").val(Flag + '\n'+ ".dc" + " " + source + " " + start + "e" + "-" + start_dc_unit + " " +  stop + "e" + "-" + stop_dc_unit + " " + increment + "e" + "-" + increment_dc_unit + '\n' + '\n'+ ".control \n"+ "run \n"+ "print allv > dumpv.txt \n" + "print alli > dumpi.txt \n" + ".endc \n"+ ".end \n" );

  change_val = "1";
  console.log(jQuery("#analysis_selectbox").val());
}


/*------------------------------------------------------------------------------------------------------------------------------------------------
Here are the all AC Cases for generating final netlist values
------------------------------------------------------------------------------------------------------------------------------------------------*/
else if (analysis_type == "2")
{
  jQuery("#webtronics_netlist_text_area").val(Flag + '\n'+ ".ac" + " " + scale_val + " " + noofpoint + " " + startfreq + start_ac_unit + " " + stopfreq + stop_ac_unit + '\n' + '\n'+ ".control \n"+  "run \n"+ "print allv > dumpv.txt \n" + "print alli > dumpi.txt \n" + ".endc \n"+  ".end \n" );

  change_val = "1";
} 
/*------------------------------------------------------------------------------------------------------------------------------------------------
Here are the all Transiet Cases for generating final netlist values
------------------------------------------------------------------------------------------------------------------------------------------------*/
  //else if (analysis_type == "3" && time == "1")
  else if (analysis_type== "3")
  {
    jQuery("#webtronics_netlist_text_area").val(Flag + '\n' + ".tran" + " " + step_trans + "e" + "-" + step_trans_unit + " " + stop_trans + "e"+ "-" + stop_trans_unit + " " + start_trans + "e" + "-" + start_trans_unit + '\n' + '\n'+ ".control \n"+  "run \n"+ "print allv > dumpv.txt \n" + "print alli > dumpi.txt \n" + ".endc \n" +".end \n" ); 

    change_val = "1";
  }


}

else if( change_val == "1")

{

  jQuery("#webtronics_netlist_text_area").val("");
      //console.log("if when 1")

      if (analysis_type == "1") 

      { 


       jQuery("#webtronics_netlist_text_area").val(Flag + '\n'+ ".dc" + " " + source + " " + start + "e" + "-" + start_dc_unit + " " +  stop + "e" + "-" + stop_dc_unit + " " + increment + "e" + "-" + increment_dc_unit + '\n' + '\n'+ ".control \n"+ "run \n"+ "print allv > dumpv.txt \n" + "print alli > dumpi.txt \n" +  ".endc \n"+ ".end \n" );
       change_val = "1";
     }       



     else if (analysis_type == "2")
     {
      jQuery("#webtronics_netlist_text_area").val(Flag + '\n'+ ".ac" + " " + scale_val + " " + noofpoint + " " + startfreq + start_ac_unit + " " + stopfreq + stop_ac_unit + '\n' + '\n'+ ".control \n"+  "run \n"+ "print allv > dumpv.txt \n" + "print alli > dumpi.txt \n" +   ".endc \n"+ ".end \n" );

      change_val = "1";
    } 


    else if (analysis_type == "3")
    {
      jQuery("#webtronics_netlist_text_area").val(Flag + '\n' + ".tran" + " " + step_trans + "e" + "-" + step_trans_unit + " " + stop_trans + "e"+ "-" + stop_trans_unit + " " + start_trans + "e" + "-" + start_trans_unit + '\n' + '\n'+ ".control \n"+  "run \n"+ "print allv > dumpv.txt \n" + "print alli > dumpi.txt \n" + ".endc \n" +".end \n" ); 

      change_val = "1";
    }


  }







}
else {
  alert("Analysis information is not available !");


}




});
}





jQuery("#webtronics_analysis").click(function(){
  flag1=1;
  jQuery('#webtronics_netlist_analysis').show();

  jQuery('#webtronics_disable').show();



});

jQuery(".button_cancel").click(function(){
  flag1=0;
  jQuery("#webtronics_netlist_analysis").hide();
  jQuery("#webtronics_disable").hide();

});





if($('webtronics_run')){
  Event.observe($('webtronics_run'), 'click', function() {
		      //                    webtronics.postspice(webtronics.circuit.createnetlist());
		      netlistcreator.createnetlist(webtronics.gnucapjs);
		    });

}

if($('webtronics_invert')){

  Event.observe($('webtronics_invert'),'click',function(){
    webtronics.circuit.invert($('webtronics_invert').checked);

  });
}		
if($('webtronics_graph')){
  Event.observe($('webtronics_graph'),'click',function(){
    if($('webtronics_graph').checked){
     webtronics.circuit.graph=true;
     webtronics.circuit.showbackground();									
   }
   else{
     webtronics.circuit.graph=false;
     webtronics.circuit.showbackground();									
   }
 });
}
if($('webtronics_connections')){
  $('webtronics_connections').checked=false;
  Event.observe($('webtronics_connections'),'click',function(){
    webtronics.circuit.showconnections($('webtronics_connections').checked);

  });
}
if($("webtronics_showhelp")){
  Event.observe($("webtronics_showhelp"),"click",function(){
   if($("webtronics_showhelp").checked){
    $$(".webtronics_help").forEach(function(e){
     e.style.display="block";
   });
  }
  else{
    $$(".webtronics_help").forEach(function(e){
     e.style.display="none";
   });
  }
});
}
/*properties events*/		


if($('webtronics_properties_ok'))Event.observe($('webtronics_properties_ok'), 'click', function() {
  $("webtronics_print_dir_field").style.display="none";
  $('webtronics_properties_div').style.display='none';
  webtronics.enablepage();
  var model=webtronics.circuit.selected[0];
  netlistcreator.writewtx(model,"id",$('webtronics_part_id').value);
  netlistcreator.writewtx(model,"value",$('webtronics_part_value').value);
  netlistcreator.writewtx(model,"model",$('webtronics_part_dir_value').value);
  netlistcreator.writewtx(model,"measure",$('webtronics_print_dir_value').value);
  
  var modelname=netlistcreator.readwtx(model,"name");

  if(modelname=="ac"){
    netlistcreator.writewtx(model,"phase",$('webtronics_phase_value').value);
    netlistcreator.writewtx(model,"amplitude",$('webtronics_amplitude_value').value);

  }
  else if(modelname=="sinvoltagesource"){
    netlistcreator.writewtx(model,"offsetvoltage",$('webtronics_offsetvoltage_value').value);
    netlistcreator.writewtx(model,"voltageamplitude",$('webtronics_voltageamplitude_value').value);
    netlistcreator.writewtx(model,"frequency",$('webtronics_frequency_value').value);
    netlistcreator.writewtx(model,"delaytime",$('webtronics_delaytime_value').value);
    netlistcreator.writewtx(model,"dampingfactor",$('webtronics_dampingfactor_value').value);

  }
  else if(modelname=="pulse"){
    netlistcreator.writewtx(model,"pulval1",$('webtronics_pulval1_value').value);
    netlistcreator.writewtx(model,"pulval2",$('webtronics_pulval2_value').value);
    netlistcreator.writewtx(model,"pulval3",$('webtronics_pulval3_value').value);
    netlistcreator.writewtx(model,"pulval4",$('webtronics_pulval4_value').value);
    netlistcreator.writewtx(model,"pulval5",$('webtronics_pulval5_value').value);
    netlistcreator.writewtx(model,"pulval6",$('webtronics_pulval6_value').value);
    netlistcreator.writewtx(model,"pulval7",$('webtronics_pulval7_value').value);                   
  }
  else if(modelname=="pwl"){
    netlistcreator.writewtx(model,"pwlval1",$('webtronics_pwlval1_value').value);
    netlistcreator.writewtx(model,"pwlval2",$('webtronics_pwlval2_value').value);
    netlistcreator.writewtx(model,"pwlval3",$('webtronics_pwlval3_value').value);
    netlistcreator.writewtx(model,"pwlval4",$('webtronics_pwlval4_value').value);
    netlistcreator.writewtx(model,"pwlval5",$('webtronics_pwlval5_value').value);
    netlistcreator.writewtx(model,"pwlval6",$('webtronics_pwlval6_value').value);
    netlistcreator.writewtx(model,"pwlval7",$('webtronics_pwlval7_value').value);                   
    netlistcreator.writewtx(model,"pwlval8",$('webtronics_pwlval8_value').value);                   
  }
  else if(modelname=="exponential"){
    netlistcreator.writewtx(model,"eval1",$('webtronics_eval1_value').value);
    netlistcreator.writewtx(model,"eval2",$('webtronics_eval2_value').value);
    netlistcreator.writewtx(model,"eval3",$('webtronics_eval3_value').value);
    netlistcreator.writewtx(model,"eval4",$('webtronics_eval4_value').value);
    netlistcreator.writewtx(model,"eval5",$('webtronics_eval5_value').value);
    netlistcreator.writewtx(model,"eval6",$('webtronics_eval6_value').value);
  }


  webtronics.circuit.createvalue(webtronics.circuit.selected[0]);
});

  if($('webtronics_properties_cancel'))Event.observe($('webtronics_properties_cancel'), 'click', function() {
    $("webtronics_print_dir_field").style.display="none";
    $('webtronics_properties_div').style.display='none';
    webtronics.enablepage();
  });

    if($('webtronics_part_model'))Event.observe($('webtronics_part_model'),'change',function(){
      var part=netlistcreator.readwtx(webtronics.circuit.selected[0],"name");
      var cat=netlistcreator.readwtx(webtronics.circuit.selected[0],"category");
      if($('webtronics_part_model').value){
        $("webtronics_part_dir_model").options.length=0;
        $("webtronics_part_dir_model").appendChild(new Element("option",{"value":""}).update("none"));
        for( var i=0;i<webtronics.partslists.length;i++){
         for(var j=0;j<webtronics.partslists[i].parts[cat][part].values[$('webtronics_part_model').value].length;j++){
           $("webtronics_part_dir_model").insert(new Element("option",{"value":webtronics.partslists[i].parts[cat][part].values[$('webtronics_part_model').value][j]}).update(webtronics.partslists[i].parts[cat][part].values[$('webtronics_part_model').value][j]));
         }
       }
     }
     $('webtronics_part_value').value=$("webtronics_part_model").options[$("webtronics_part_model").selectedIndex].value;

   });

      if($('webtronics_part_dir_model'))Event.observe($('webtronics_part_dir_model'),'change',function(){
        $('webtronics_part_dir_value').value=$("webtronics_part_dir_model").options[$("webtronics_part_dir_model").selectedIndex].value;

      });
		  //**OPEN LOCAL SPICE MODELS EXPERIMENT
		  //            if($("webtronics_part_file"))Event.observe($("webtronics_part_file"),'change',function(){
		  // 	      console.log($("webtronics_part_file").files[0]);
		  // 		    if(window.FileReader){
		  // 			  
		  // 				    var textReader = new FileReader();
		  // 				    textReader.onloadend=function(){
		  // 					    if(!textReader.result){
		  // 						    console.log("error opening file");
		  // 						    return;
		  // 					    };
		  // 
		  // 				    }.bind(this);
		  // 				    textReader.readAsText();
		  //     		    }
		  // 		    }.bind(this));
		  
		  /*save as png modal*/
		  if($("webtronics_image_ok")){
        Event.observe($('webtronics_image_ok'), 'click', function() {
          webtronics.enablepage();
          $('webtronics_image').style.display='none';
          webtronics.setMode('select','Selection');
        });


      }

      /*chip box events*/
      Event.observe($('webtronics_vert_pins'), 'change', function() {
        $("webtronics_chip_display").parentNode.removeChild($("webtronics_chip_display"));
        var div=new Element("div",{id:"webtronics_chip_display"})
        .insert(chipmaker.drawchip($('webtronics_hor_pins').value,$('webtronics_vert_pins').value));
        $("webtronics_chips_box").insertBefore(div,$("webtronics_chips_box").firstChild);
      });
      Event.observe($('webtronics_hor_pins'), 'change', function() {
        $("webtronics_chip_display").parentNode.removeChild($("webtronics_chip_display"));
        var div=new Element("div",{id:"webtronics_chip_display"})
        .update(chipmaker.drawchip($('webtronics_hor_pins').value,$('webtronics_vert_pins').value));
        $("webtronics_chips_box").insertBefore(div,$("webtronics_chips_box").firstChild);
      });

      Event.observe($('webtronics_chip_spice_select'), 'change', function() {
        $("webtronics_chip_display").parentNode.removeChild($("webtronics_chip_display"));
        var div=new Element("div",{id:"webtronics_chip_display"})
        $("webtronics_chips_box").insertBefore(div,$("webtronics_chips_box").firstChild);
        $("webtronics_chip_spice").value=$('webtronics_chip_spice_select').value;
        if($('webtronics_chip_spice_select').value!="none"){
          openfile("symbols/predefined/"+$('webtronics_chip_spice_select').value+".svg",function(svg){
           div.update(svg);
           var model=$("webtronics_chip_display").getElementsByTagName("g")[0];
           netlistcreator.writewtx(model,"value",$('webtronics_chip_spice_select').value);
           netlistcreator.writewtx(model,"model",webtronics.models[$('webtronics_chip_spice_select').value]);
         });
        }
      });


      Event.observe($('webtronics_chip_ok'), 'click', function() {
        webtronics.enablepage()
        webtronics.returnchip();
		    //chipmaker.clear();
		  });
      Event.observe($('webtronics_chip_cancel'), 'click', function() {
        webtronics.enablepage();
        $('webtronics_chips_box').style.display='none';
        webtronics.setMode('select','Selection');
      });
      /*text add events*/
      if($("webtronics_text_ok")){
        Event.observe($('webtronics_text_ok'), 'click', function() {
          webtronics.circuit.addtext($('webtronics_comment').value);
          $('webtronics_add_text').style.display='none';
          webtronics.setMode('select','Selection');
        });
      }
      if($("webtronics_text_cancel")){
        Event.observe($('webtronics_text_cancel'), 'click', function() {
          webtronics.setMode('select','Selection');
          $('webtronics_add_text').style.display='none';
        });
      }
      /*netlist text events*/
      if($("webtronics_netlist_text_ok")){
        Event.observe($('webtronics_netlist_text_ok'), 'click', function() {
          webtronics.setMode('select','Selection');
          $('webtronics_netlist_text').style.display='none';
          webtronics.enablepage();
        });
      }


    




      if($("webtronics_netlist_text_run")){
        Event.observe($('webtronics_netlist_text_run'), 'click', function() {
          webtronics.gnucapjs($("webtronics_netlist_text_area").value);
		      //$('webtronics_netlist_text').style.visibility='none';
		      //webtronics.enablepage();
		    });
      }  
      /*scope events*/
      if($("webtronics_scope_display")){
        this.scopestatus=$("webtronics_scope_status");
        this.scopedata=$("webtronics_scope_data");

        $("webtronics_scope_output_graph").checked=true;
        Event.observe($("webtronics_scope_output_graph"),'click',function(){$("webtronics_scope_display_frame").contentWindow.displaygraph()});
        Event.observe($("webtronics_scope_output_log"),'click', function(){$("webtronics_scope_display_frame").contentWindow.displaylog()});

        Event.observe($('webtronics_scope_display_ok'), 'click', function() {
          webtronics.setMode('select','Selection');
          $('webtronics_scope_display').style.display='none';
          $('webtronics_scope_display_div').innerHTML="";
		      //                    webtronics.enablepage();
		    });
        Event.observe($('webtronics_scope_display_stop'), 'click', function() {
          webtronics.setMode('select','Selection');
          $("webtronics_scope_display_frame").contentWindow.stopsimulation()				
//		      $('webtronics_scope_display').style.display='none';
//		      $('webtronics_scope_display_div').innerHTML="";
		      //                    webtronics.enablepage();
		    });



        Event.observe($("webtronics_scope_display"),'mousedown',function(e){
          var startx=e.layerX;
          var starty=e.layerY;
          Event.observe($("webtronics_scope_display"),'mousemove',function(e){
           $("webtronics_scope_display").style.top =e.clientY-starty + 'px';
           $("webtronics_scope_display").style.left =e.clientX-startx + 'px';
         });
          e.preventDefault();
        });
        Event.observe($("webtronics_scope_display"),'mouseup',function(){
          Event.stopObserving($("webtronics_scope_display"),'mousemove');
        });            

      }



      /*text open events*/
      Event.observe($('webtronics_open_text_ok'), 'click', function() {
        $('webtronics_open_text').style.display='none';
      });
      Event.observe($('webtronics_open_text_cancel'), 'click', function() {
        webtronics.setMode('select','Selection');

        $('webtronics_open_text').style.display='none';
      });
		  //sources events
		  Event.observe($('webtronics_add source_ok'), 'click', function() {
        var sources=$$(".webtronics_add_source_input");
        var addresses=[]
        for( var i=0;i<sources.length;i++){
         if(sources[i].value.match(/.*/)!=-1)addresses.push(sources[i].value);
       }	
       webtronics.serverurls=addresses;
       webtronics.populatemenu();
       $('webtronics_add source').style.display='none';
       webtronics.enablepage();
     });
		  
		  Event.observe($("webtronics_add_source_cancel"), 'click', function() {
        webtronics.setMode('select','Selection');

        $('webtronics_add source').style.display='none';
        webtronics.enablepage();
      });
		  
		  
		  
    }.bind(this));

}
}
webtronics.init();
