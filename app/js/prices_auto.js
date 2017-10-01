var prices = {}

var price_script = document.createElement('script');
price_script.src = '/known_phones?callback=getPrice'

document.getElementsByTagName('head')[0].appendChild(price_script);

function tuneModel(modelName)
{
	if (modelName.indexOf("iPhone")>=0)
		return modelName.replace('iPhone ','').toLowerCase()
	if (modelName.indexOf("Galaxy")>=0)
		return modelName.replace('Galaxy ','').toLowerCase() //replace(/\ [^\ ]*$/,'').
	else
		return modelName;
}

function getPrice(arr)
{
	var brands = $.map(arr, function(element,index) {return index})

	for (var i=0; i<brands.length; i++)
	{
		prices[brands[i].toLowerCase()] = {}

		var models = []
		for (var j=0; j<arr[brands[i]].length; j++)
		{
			var curr_model = tuneModel(arr[brands[i]][j]["model"]).replace('+', ' plus');
			prices[brands[i].toLowerCase()][curr_model] = {}

			var memories = []
			var mem_colors = []
			for (var k=0; k<arr[brands[i]][j]["models"].length; k++)
			{
				var curr_item = arr[brands[i]][j]["models"][k];
				var curr_memory = curr_item["memory"].replace(' GB','')
				var curr_color = curr_item["color"].trim()

				if (memories.indexOf(curr_item["memory"])<0)
				{
					prices[brands[i].toLowerCase()]
						[curr_model]
						[curr_memory] = {}

					memories.push(curr_item["memory"])
				}
				if (mem_colors.indexOf(curr_item["memory"] + curr_item["color"])<0)
				{
					prices[brands[i].toLowerCase()]
						[curr_model]
						[curr_memory]
						[curr_color] = {}
					mem_colors.push(curr_item["memory"] + curr_color)

					prices[brands[i].toLowerCase()]
						[curr_model]
						[curr_memory]
						[curr_color]
						[curr_item["condition"]] = Math.round(curr_item["price"])

					prices[brands[i].toLowerCase()]
						[curr_model]
						[curr_memory]
						[curr_color]
						["product_id"] = curr_item["id"]
				}

				prices[brands[i].toLowerCase()]
					[curr_model]
					[curr_memory]
					[curr_color]
					[curr_item["condition"]] = Math.round(curr_item["price"])

				prices[brands[i].toLowerCase()]
					[curr_model]
					[curr_memory]
					[curr_color]
					["product_id"] = curr_item["id"]
			}

		}

		//console.log(prices)
	}
}
