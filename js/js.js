var apiUrl = "http://pokeapi.co/api/v1/";
var baseApiUrl = "http://pokeapi.co";
var pokemons = [];
var loadedPoks = 0;

$(function(){
	$('#more-btn').click(function (){
		getPokemon(loadedPoks, 12);
		$(this).prop("disabled", true);
	});

	$(".poke-main").on("click", '.poke-box', function() {
		var id = $(this).data("id");
		fillSidebar(pokemons[id]);
		$('.poke-box').removeClass('active');
		$(this).addClass('active');
	});


})	
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

//  typesToString(types, "", ", "); => bug, fire;
//  typesToString(types, "_type", " ") => bug_type fire_type
// test

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
	console.log(pokemon);
	var htmlPoc = "<div class=\"col-xs-4\"><div class=\"poke-box " + typesToString (pokemon.types, "_type", " ") + "\" data-id=\"" + pokemon.national_id+"\"> ";
	htmlPoc += "<span><img src=\"bulbazar.png\" alt=\"bulbazar\" height=\"96\" width=\"96\"></span>";
	htmlPoc += 	"<h3>" + pokemon.name +"</h3>";
	htmlPoc +=	"<div class=\"button-box\">";
	for (var i = 0; i < pokemon.types.length; i++){
		htmlPoc += "<input class=\""+pokemon.types[i].name +"\" type=\"button\" value=\""+ pokemon.types[i].name +"\"> "
	}
	htmlPoc +=	"</div></div></div> ";
	$(".poke-main .row").append(htmlPoc);
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


