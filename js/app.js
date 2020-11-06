var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'Projeto saúde',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
      {   
        path: '/home/',
        url: 'index.html?n=g', 
        on:{
          pageInit:function(){
            teste();
            
          },
        },      
      },
      {
        path: '/cadastro/',
        url: 'cadastro.html?b=b',
        on:{
          pageInit:function(){
            Cadastro_usuarios();

          },
        }, 
      },

      {
        path: '/cadastro-alimentos/',
        url: 'cadastro-alimentos.html?d=b',
        on:{
          pageInit:function(){
          
            alimentacao();
            
          },
        }, 
      },

    ],
    // ... other parameters
  });

  var mainView = app.views.create('.view-main');
  var $$ = Dom7;
  var popup = app.popup.open(".popup-inicial"); 
  const cod_usuario = localStorage.getItem('ID_cadastro');



  setTimeout(function(){
   var popupClose = app.popup.close(".popup-inicial", true);
   }, 3000); //3000 = padrão de tempo

  
   $(".descricao").hide();
  
  //  $(".foto-comida").hide();

  window.onload= function(){  
    $("#login").hide();
    if(cod_usuario){
   
      $(".descricao").show(); 
      $("#login").hide();
      
      $(".for-list").show();
      $("#btn-test").show();
     
  
    }else{
      $(".descricao").hide(); 
      $("#login").show();
      $(".for-list").hide();
      $("#btn-test").hide();
      
      

      //colocar o botão sair  semelhante=  $("#btn-prato").hide(); 
    }
  }

  $("#sair").click(function(){
    localStorage.removeItem('ID_cadastro');
    localStorage.removeItem('usuario');
    btnLogout();
  });

  function btnLogin(){
    setTimeout(function(){
      $(".descricao").show(); 
      $("#login").hide();
      $("#sair").show() 
      $(".for-list").show();
      $("#btn-test").show();
  
    },500);
  }

  function btnLogout(){
    setTimeout(function(){
      $(".descricao").hide(); 
      $("#login").show();
      $("#sair").hide();
  
    },500);
  }

  


    // login
    $("#entrar").click(function(e){
      e.preventDefault(); //evento =  padrão não retorna

        var usuario =$("#usuario").val();
        var senha = $("#senha").val();
        if(usuario.trim() == "" || senha.trim() == ""){
          app.dialog.alert("Os campos usuário e senha são obrigatórios!"), "";
          return false
        }
        // alert(email + " | " + senha);

        //Requisição AJAX
        app.request({
     
          url:"https://www.limeiraweb.com.br/renata/saude/login.php",
          type:"POST",
          dataType:"json",
          data:$("#Formlogin").serialize(),
          success:function(data){
            if(data.resultado != 0){
             
                app.dialog.preloader("Bem-vindo "+usuario);
                setTimeout(function () {
                  app.dialog.close();
                }, 3000);
  
              //  alert("Usuário existe");
              //  console.log(data);

              localStorage.setItem('ID_cadastro',data.ID_cadastro);
              localStorage.setItem('usuario',data.usuario);
              $("#usuario,#senha").val("");
              app.views.current.router.back();
              btnLogin();
            }else{
             app.dialog.alert("Usuário ou senha incorretos!","");
             $("#usuario,#senha").val("");
            }
            
          },
          error: function(e){
            app.dialog.alert("404","Erro");
            $("#usuario,#senha").val("");
          }
        });
    });
       // fim

    // cadastro do login
    function Cadastro_usuarios(){

      $("#cadastrando").click(function(e){
        e.preventDefault();
  
        var nome = $("#nome").val();
        var usuarioC = $("#usuarioC").val();
        var senhaC = $("#senhaC").val();
        var data_nasc = $("#data_nasc").val();
        
        
  
        if(nome.trim() == ""){
          app.dialog.alert("Informe o campo Nome <br> Seu nome completo para indentificação no histórico ","Aviso");
          return false;
        }
        if(usuarioC.trim() == ""){
          app.dialog.alert("Informe o campo Usuário que será usado no login","Aviso");
          return false;
        }
        if(senhaC.trim() == ""){
          app.dialog.alert("Informe o campo Senha","Aviso");
          return false;
        }
        if(data_nasc.trim() == ""){
          app.dialog.alert("Informe o campo Data de nascimento","Aviso");
          return false;
        }
       
        
         //insert
         app.request.post('https://www.limeiraweb.com.br/renata/saude/insertLogin.php',{
          nome:nome,
          usuarioC:usuarioC,
          senhaC:senhaC,
          data_nasc:data_nasc
       
         },
         function(data){
           if(data != "existe"){
              app.dialog.alert("Cadastrado com sucesso", "");
                $("#nome,#usuarioC,#senhaC,#data_nasc").val("");
               
                
            }else{
                app.dialog.alert("Usuaário utilizado já existe","");
                $("#nome,#usuarioC,#senhaC,#data_nasc").val("");
                
            }
          
         });
      });
  
    }

    // consulta de alimentos index
    var autocompleteDropdownSimple = app.autocomplete.create({
      inputEl: '#autocomplete_nome',
      openIn: 'dropdown',
      source: function (query, render) {
        var results = [];
        if (query.length === 0) {
          render(results);
          return;
        }
        // Find matched items
        for (var i = 0; i < Listaclubes.length; i++) {
          if (Listaclubes[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(Listaclubes[i]);
        }
        // Render items by passing array with result items
        render(results);
      }
    }); 


    var Listaclubes = "";
    app.request.post('https://www.limeiraweb.com.br/renata/saude/lista-nomes.php', {}, function (resposta){
      Listaclubes =  (resposta).split(',');
  
  });
         //função disparada com o botão for clicado 
         $$('.btn-buscar').on('click',function(){
          //  app.dialog.alert("Pegandooo");
          var Vlista = $$('#autocomplete_nome').val();
          var Vdata = $$('#data').val();
          
          if(Vlista.trim() == "" || Vdata.trim() == ""){
            app.dialog.alert("Informe seu nome e a data para realização da pesquisa","Aviso");
            return false;
          }

  
          //chama assincorona, passando um parâmetro
         app.request.post('https://www.limeiraweb.com.br/renata/saude/lista-de-usuarios.php',{autocomplete_nome:Vlista,data:Vdata}, function (resposta){
              dados = (resposta).split('|');
              $$('#resultado').html(dados[0]); //tratando o resultado
              $$('#IDListaSelecionado').val(dados[1]);
              $$('#DescricaoSelecionado').val(dados[2]);
              $$('#KcalSelecionado').val(dados[3]);
  
              $$('#autocomplete_nome').val("");
              $$('#data').val("");
              
          });
  
        });






    // lista de alimentos 
function alimentacao(){
  var Listaclubes = "";
  app.request.post('https://www.limeiraweb.com.br/renata/saude/lista-de-alimentos.php', {}, function (resposta){
    Listaclubes =  (resposta).split(',');

});

    // Fruits data demo array
   // var ListaCidades = ('Limeira,São Paulo,Campinas,Piracicaba').split(',');

    var autocompleteDropdownSimple = app.autocomplete.create({
        inputEl: '#autocomplete_dropdown',
        openIn: 'dropdown',
        source: function (query, render) {
          var results = [];
          if (query.length === 0) {
            render(results);
            return;
          }
          // Find matched items
          for (var i = 0; i < Listaclubes.length; i++) {
            if (Listaclubes[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(Listaclubes[i]);
          }
          // Render items by passing array with result items
          render(results);
        }
      }); 

      

       //função disparada com o botão for clicado 
       $$('.btn-lista').on('click',function(){
          // app.dialog.alert("Pegandooo");
        var Vlista = $$('#autocomplete_dropdown').val();
        if(Vlista.trim() == "" ){
          app.dialog.alert("Informe o nome do alimento  para a realização da pesquisa","Aviso");
          return false;
        }


        //chama assincorona, passando um parâmetro
       app.request.post('https://www.limeiraweb.com.br/renata/saude/alimentacao-hoje.php',{autocomplete_dropdown:Vlista}, function (resposta){
            dados = (resposta).split('|');
            $$('#resultadoList').html(dados[0]); //tratando o resultado
            $$('#IDListaSelecionado').val(dados[1]);
            $$('#DescricaoSelecionado').val(dados[2]);
            $$('#KcalSelecionado').val(dados[3]);

            $$('#autocomplete_dropdown').val("");
        
            
        });

      });

      var autocompleteDropdownSimple = app.autocomplete.create({
        inputEl: '#autocomplete_lista',
        openIn: 'dropdown',
        source: function (query, render) {
          var results = [];
          if (query.length === 0) {
            render(results);
            return;
          }
          // Find matched items
          for (var i = 0; i < Listaclubes.length; i++) {
            if (Listaclubes[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(Listaclubes[i]);
          }
          // Render items by passing array with result items
          render(results);
        }
      }); 
   
      
 
  
        $$('#btn-test').on('click', function (){

      
          var autocomplete_lista = $$('#autocomplete_lista').val(); 
          var nome_completo = $$('#nome_completo').val(); 
          var data_hoje = $$('#data_hoje').val();
          var kcal = $$('#kcal').val(); 

       
          if(nome_completo.trim() == "" ){
            app.dialog.alert("Informe no campo Nome <br> Seu nome  completo para sua indentificação na pesquisa do histórico ","Aviso");
            return false;
          }
        
          if(autocomplete_lista.trim() == "" ){
            app.dialog.alert("Informe o Alimento que deseja cadastrar ","Aviso");
            return false;
          }
       
          if(kcal.trim() == "" ){
            app.dialog.alert("Informe o campo  Caloria","Aviso");
            return false;
          }
          if(data_hoje.trim() == "" ){
            app.dialog.alert("Informe o campo Data ","Aviso");
            return false;
          }
           

          app.request.post('https://www.limeiraweb.com.br/renata/saude/gravando-movimento.php',{
            autocomplete_lista:autocomplete_lista,
            nome_completo:nome_completo,
            data_hoje:data_hoje,
            kcal:kcal
           
           },
           function(data){
             if(data != "existe"){

              app.dialog.preloader("Cadastrando com sucesso!");
              setTimeout(function () {
                app.dialog.close();
              }, 3000);
        
                  $("#autocomplete_lista,#nome_completo,#data_hoje,#kcal").val("");
                  
              }else{
                  app.dialog.alert("Tente novamente ","Erro");
                  $("#autocomplete_lista,#nome_completo,#data_hoje,#kcal").val("");
              }
           
           });

          
      });


}
   

   
          

        

    