"use strict"

// NUMBER OF SUBSCRIBERS

var numberofadh = 0;

for (let i = 0; i < database.length; i++) {
  numberofadh++
}

new Vue({
  el: '#nbradh',
  data: {
    value: "Nombre d'adhérents actuellement : " + numberofadh,
  }
})

//-------------------------------------------------//

// Average AGE

var begin = 0;

for (let i = 0; i < database.length; i++) {
  var age = database[i].age;
  var ageadd = begin += database[i].age;
  var begin = ageadd;
}


for (let i = 0; i < database.length; i++) {
  var nbrdb = database[i].index;
}


var average_age = begin / nbrdb;

new Vue({
  el: '#avgage',
  data: {
    average: "Moyenne d'age des utilisateurs : " + Math.round(average_age) + " ans",
  }
})

// CURRENT YEAR SUBSCRIBERS

var trueregistered = 0;

for (let i = 0; i < database.length; i++) {
  var datefr = database[i].registered;
  var anneerecherchee = "2019";
  var check = datefr.includes(anneerecherchee);
  if (check === true) {
    trueregistered++
  }
}

new Vue({
  el: '#regyear',
  data: {
    value: "Adhérents inscrits cette année : " + trueregistered,
  }
})


// DATABASE JSON ---> ANCRES GENDER

var stockdatabase = database;

var male = 0;
var female = 0;

for (var i = 0; i < database.length; i++) {
  var gend = database[i].gender;
  if (gend === "female") {
    var gendf = "female = " + (female++)
  } else {
    var gendm = "male = " + (male++)
  }
}

// Female Count = gendf // Male Count = gendm

var gendm = male; // Number of Females
var gendf = female; // Number of Males

// CALCUL POURCENTAGE

var femmespourcentage = (100 * gendf) / nbrdb;
var pourcentf = Math.round(femmespourcentage * 100) / 100;

var hommespourcentage = (100 * gendm) / nbrdb;
var pourcentm = Math.round(hommespourcentage * 100) / 100;


//-----------------------------------------
new Vue({
  el: '#male',
  data: {
    malecount: "Hommes : " + pourcentf + " %",
  }
})

new Vue({
  el: '#female',
  data: {
    femalecount: "Femmes : " + pourcentm + " %",
  }
})


// ------------- DOUGHNUT CHART ---------------

var containerdonut = document.getElementById('canvas');

new Chart(containerdonut, {
  type: 'doughnut',
  data: {
    labels: ["Femmes", "Hommes"],
    datasets: [{
      label: "Parité Homme/Femmes",
      backgroundColor: ["#ce0033", "#565353"],
      data: [gendf, gendm],
    }]
  },
  options: {}
});


// -------- DOUGHNUT CHART END ------------


var monVue = new Vue({
  el: "#content",
  data: {
    utilisateur: '',
    database, // database est ici pour etre utilisé par les elements "titres" par exemple
    titres: { // vas servir d'ancrage a " xxxx for titres "
      Nom: "nom", // xxxx =
      Adress: "adresse", // xxxx =
      Age: "age", // xxxx =
    },
    search: "" // valeur de search qui est le v-model , on peut la modifier ici également ce qui rends un resultat bilatéral et dynamique
  },
  computed: {
    filtreNom() { // a this.database s'ajoute la function filter de vue qui sert a definir un filtre
      return this.database.filter(adherent => { // this.database renvoie toute la vue donc la fonction et l'expression flechée est le substitut du nom de la fonction
        return adherent.name.toLowerCase().includes(this.search.toLowerCase())

        // recupère les noms dans la database adherent qui incluent ce qui est noté dans search , tout en passant les deux en miniscule.
      })
    }
  },
  methods: {
    selection: function(xxx) {
      this.utilisateur = xxx;

    }
  }

})


// JQUERY

getPagination('#table-id');

function getPagination(table) {

  var lastPage = 1;

  $('#maxRows').on('change', function(evt) {


    lastPage = 1;
    $('.pagination').find("li").slice(1, -1).remove();
    var trnum = 0; // reset tr counter
    var maxRows = parseInt($(this).val()); // get Max Rows from select option

    if (maxRows == 5000) {

      $('.pagination').hide();
    } else {

      $('.pagination').show();
    }

    var totalRows = $(table + ' tbody tr').length; // numbers of rows
    $(table + ' tr:gt(0)').each(function() { // each TR in  table and not the header
      trnum++; // Start Counter
      if (trnum > maxRows) { // if tr number gt maxRows

        $(this).hide(); // fade it out
      }
      if (trnum <= maxRows) {
        $(this).show();
      } // else fade in Important in case if it ..
    }); //  was fade out to fade it in
    if (totalRows > maxRows) { // if tr total rows gt max rows option
      var pagenum = Math.ceil(totalRows / maxRows); // ceil total(rows/maxrows) to get ..
      //	numbers of pages
      for (var i = 1; i <= pagenum;) { // for each page append pagination li
        $('.pagination #prev').before('<li data-page="' + i + '">\
            <span>' + i++ + '<span class="sr-only">(current)</span></span>\
          </li>').show();
      } // end for i
    } // end if row count > max rows
    $('.pagination [data-page="1"]').addClass('active'); // add active class to the first li
    $('.pagination li').on('click', function(evt) { // on click each page
      evt.stopImmediatePropagation();
      evt.preventDefault();
      var pageNum = $(this).attr('data-page'); // get it's number

      var maxRows = parseInt($('#maxRows').val()); // get Max Rows from select option

      if (pageNum == "prev") {
        if (lastPage == 1) {
          return;
        }
        pageNum = --lastPage;
      }
      if (pageNum == "next") {
        if (lastPage == ($('.pagination li').length - 2)) {
          return;
        }
        pageNum = ++lastPage;
      }

      lastPage = pageNum;
      var trIndex = 0; // reset tr counter
      $('.pagination li').removeClass('active'); // remove active class from all li
      $('.pagination [data-page="' + lastPage + '"]').addClass('active'); // add active class to the clicked
      // $(this).addClass('active');					// add active class to the clicked
      $(table + ' tr:gt(0)').each(function() { // each tr in table not the header
        trIndex++; // tr index counter
        // if tr index gt maxRows*pageNum or lt maxRows*pageNum-maxRows fade if out
        if (trIndex > (maxRows * pageNum) || trIndex <= ((maxRows * pageNum) - maxRows)) {
          $(this).hide();
        } else {
          $(this).show();
        } //else fade in
      }); // end of for each tr in table
    }); // end of on click pagination list

  }).val(5).change();
}


$(function() {
  // Just to append id number for each row
  $('table tr:eq(0)').prepend('')

  var id = 0;

  $('table tr:gt(0)').each(function() {
    id++
    $(this).prepend('');
  });
})


//------------------------------------------------------------



// SORTING ------------------------------


function SortByName(a, b) {
  var aName = a.name.toLowerCase();
  var bName = b.name.toLowerCase();
  return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}

function SortByNamereverse(a, b) {
  var aName = a.name.toLowerCase();
  var bName = b.name.toLowerCase();
  return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
}

function SortByAge(a, b) {
  var aName = a.age;
  var bName = b.age;
  return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}

function SortByAgereverse(a, b) {
  var aName = a.age;
  var bName = b.age;
  return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
}

function SortByGender(a, b) {
  var aName = a.gender.toLowerCase();
  var bName = b.gender.toLowerCase();
  return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}

function SortByGenderreverse(a, b) {
  var aName = a.gender.toLowerCase();
  var bName = b.gender.toLowerCase();
  return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
}

function SortByRegistration(a, b) {
  var aName = a.registered.toLowerCase();
  var bName = b.registered.toLowerCase();
  return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}

function SortByRegistrationReversed(a, b) {
  var aName = a.registered.toLowerCase();
  var bName = b.registered.toLowerCase();
  return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
}

function SortByAdherent(a, b) {
  var aName = a._id.toLowerCase();
  var bName = b._id.toLowerCase();
  return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}

function SortByAdherentreverse(a, b) {
  var aName = a._id.toLowerCase();
  var bName = b._id.toLowerCase();
  return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
}

$('#name').click(function() {
  database.sort(SortByName)
})

$('#namereverse').click(function() {
  database.sort(SortByNamereverse)
})

$('#age').click(function() {
  database.sort(SortByAge)
})

$('#agereverse').click(function() {
  database.sort(SortByAgereverse)
})

$('#gender').click(function() {
  database.sort(SortByGender)
})

$('#genderreverse').click(function() {
  database.sort(SortByGenderreverse)
})

$('#registration').click(function() {
  database.sort(SortByRegistration)
})

$('#registrationreversed').click(function() {
  database.sort(SortByRegistrationReversed)
})

$('#adhnumber').click(function() {
  database.sort(SortByAdherent)
})

$('#adhnumberreverse').click(function() {
  database.sort(SortByAdherentreverse)
})



// SORTING END -------------------------------------






//
