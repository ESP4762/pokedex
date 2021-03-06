var apiUrl = "http://pokeapi.co/api/v1/";
var baseApiUrl = "http://pokeapi.co";
var pokemons = [];
var loadedPoks = 0;
var typesFilter = '';

$(function(){
	$('#more-btn').prop("disabled", true);
	getPokemon(loadedPoks, 12);
	$('#more-btn').click(function (){
		getPokemon(loadedPoks, 12);
		$(this).prop("disabled", true);
	});

	$(".poke-main").on("click", '.poke-box', function() {
		var id = $(this).data("id");
		var sidebarToggle = $(".poke-sidebar")
		fillSidebar(pokemons[id]);
		if ($(this).hasClass("active")) {
			sidebarToggle.fadeOut();
			$(this).removeClass('active');
		} else {
			sidebarToggle.fadeIn();
			$('.poke-box').removeClass('active');
			$(this).addClass('active');
		}
	});


	$(".poke-main").on("click", ".button-box input", function () {
		var type = $(this).data("type");
		typesFilter = (type === typesFilter) ? "" : type; 
		checkFilter();
		return false; 
	}) 
})	

function checkFilter () {
	$(".button-box input").removeClass("active");
	if(typesFilter === "") {
		$(".poke-main .col-xs-4").show();
	} else {

		$(".poke-main .col-xs-4").hide();
		$(".poke-box."+typesFilter+"_type").closest(".col-xs-4").show();
		$(".button-box input."+typesFilter).addClass("active");
	}
}

function fillSidebar(pokemon) {
	$('#type').text(typesToString(pokemon.types, "", ", "));

	$('#pokeName').text(pokemon.name + " #"+ pokemon.national_id);

	$('#attack').text(pokemon.attack);

	$('#defense').text(pokemon.defense);

	$('#hp').text(pokemon.hp);

	$('#spAttack').text(pokemon.sp_atk);

	$('#spDefense').text(pokemon.sp_def);

	$('#speed').text(pokemon.speed);
 
	$('#weight').text(pokemon.weight);

	$('#tMoves').text(pokemon.moves.length);
	setSidebarImg(pokemon.national_id);
}


function typesToString (types, postfix, separator) {
	var result = '';
	for (var i = 0; i<types.length; i++) {
		result += types[i].name + postfix + separator;
	}
	return result.substr(0, result.length - separator.length);
}

function setSidebarImg(pokId){
	var url = $(".poke-box[data-id="+pokId+"] img").attr("src");
	$('.sidebar-wrapper img').attr('src', url);
}

function getPokemon(from, count){
	$.get(apiUrl + "pokemon?limit=" + count +"&offset=" + from,
		function(data){
			for (var i = 0; i < data.objects.length; i++){
				addPokemon(data.objects[i]);
				pokemons[data.objects[i].national_id] = data.objects[i];
				loadedPoks++;
			}
			$(".more-btn").prop("disabled", false);
		}, "json");
}


function addPokemon(pokemon){
	// console.log(pokemon);
	var htmlPoc = "<div class=\"col-xs-4\"><div class=\"poke-box " + typesToString (pokemon.types, "_type", " ") + "\" data-id=\"" + pokemon.national_id+"\"> ";
	htmlPoc += "<center><img src=\"img/blank.png\" alt=\"blank\" height=\"96\" width=\"96\"></center>";
	htmlPoc += 	"<h3>" + pokemon.name +"</h3>";
	htmlPoc +=	"<div class=\"button-box\">";
	for (var i = 0; i < pokemon.types.length; i++){
		htmlPoc += "<input class=\""+pokemon.types[i].name +"\" type=\"button\" value=\""+ pokemon.types[i].name +"\" data-type=\"" + pokemon.types[i].name + "\"> "
	}
	htmlPoc +=	"</div></div></div> ";
	$(".poke-main .row").append(htmlPoc);
	checkFilter();
	getPocSprite(pokemon.national_id, pokemon.sprites[0].resource_uri);
}

function getPocSprite(id, resource_uri){
		$.get(baseApiUrl + resource_uri,
		function(data){
			addSprite(id, data.image);
		}, "json");
}

function addSprite(id, image){
	$(".poke-box[data-id="+id+"] img").attr("src", "http://pokeapi.co" + image);
	if ($('.poke-box[data-id='+id+']').hasClass('active')) {
		setSidebarImg(id);
	}
}


