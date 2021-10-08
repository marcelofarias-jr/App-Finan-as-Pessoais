class Despesa{
	constructor(ano, mes, dia, tipo, descricao, valor){
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados(){
		for(let i in this){
			//this[i] - percorre so campos do objeto
			//console.log(i, this[i])
			if(this[i] == undefined || this[i] == '' || this[i] == null){
				return false
			}
		}return true
	} 
}

class Bd {
	//verifica se existe um ID, caso não tenha cria um com o valor 0
	constructor(){
		let id = localStorage.getItem('id')

		if(id === null){
			localStorage.setItem('id', 0)
		}
	}
	//recupera o ID e retorna com o novo id (id + 1)
	getProximoId(){
		let proximoId = localStorage.getItem('id')
		return (parseInt(proximoId) + 1)
	}
	//adiciona um id único, armazena o item como id e uma notação JSON
	gravar(d) {
		let id = this.getProximoId()
		localStorage.setItem(id, JSON.stringify(d))
		localStorage.setItem('id', id)
	}
	//recuperar despesas
	recuperarTodosRegistros(){

		//array de despesa
		let despesas = Array()

		let id = localStorage.getItem('id')

		for(let i = 1; i <= id; i++){
			let despesa = JSON.parse(localStorage.getItem(i))
			
			//verificando se existe deletado
			//caso tenha = pule
			if (despesa === null) {
				continue
			}

			//adicionando um indice dentro do objeto despesa
			despesa.id = i
			despesas.push(despesa)
		}
		return despesas
	}
	pesquisar(despesa){
		let despesasFiltradas = Array()
		despesasFiltradas = this.recuperarTodosRegistros()
		console.log(despesasFiltradas)
		//ano
		if (despesa.ano != ''){
		despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
		}

		//mes
		if (despesa.mes != ''){
		despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
		}

		//dia
		if (despesa.dia != ''){
		despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
		}

		//tipo
		if (despesa.tipo != ''){
		despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
		}

		//descrição
		if (despesa.descricao != ''){
		despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
		}

		//valor
		if (despesa.valor != ''){
		despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
		}
		
		return despesasFiltradas
	}
	remover(id){
		localStorage.removeItem(id)
	}
}
//iniciando um novo banco
let bd = new Bd()

function cadastrarDespesa(){
	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(
		ano.value,
		mes.value,
		dia.value,
		tipo.value,
		descricao.value,
		valor.value
	)
	if(despesa.validarDados()){
		bd.gravar(despesa)

		document.getElementById('TituloModalCentralizado').innerHTML = 'Gravação finalizada com sucesso'
		document.getElementById('titulo_modal').className = 'modal-header text-success'
		document.getElementById('texto_modal').innerHTML = 'Despesa foi gravada com sucesso!' 
		document.getElementById('botao_modal').innerHTML = 'Voltar' 
		document.getElementById('botao_modal').className = 'btn btn-success' 
		$('#modalValida').modal('show')
	
		//zerando formulário
		ano.value = ''
		dia.value = ''
		mes.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''
	}else{
		//dialog de erro JQUERY
		document.getElementById('TituloModalCentralizado').innerHTML = 'Gravação não finalizada	'
		document.getElementById('titulo_modal').className = 'modal-header text-danger'
		document.getElementById('texto_modal').innerHTML = 'Existem campos obrigatórios que não foram preenchidos' 
		document.getElementById('botao_modal').innerHTML = 'Voltar e corrigir' 
		document.getElementById('botao_modal').className = 'btn btn-danger' 

		$('#modalValida').modal('show')

	}
}

function carregarListaDespesas(despesas = Array(), filtro = false){
	//caso o array despesas esteja vazio (sem filtro) a função ira recuperar todos os registros
	if(despesas.length == 0 && filtro == false){
	despesas = bd.recuperarTodosRegistros();
	}

	//caso o array não esteja vazio ele vai recuperar as despesas filtradas passadas na função pesquisar despesas
	//selecionando o elemento tobdy	
	let listaDespesas = document.getElementById('listaDespesas')
	//limpando a tabela
	listaDespesas.innerHTML = ''
	//percorer o Array despesa listando as depesas de forma dinâmica
	despesas.forEach(function (d){

		//criando a linha (tr)
		let linha = listaDespesas.insertRow()

		//inserindo valores, criando as colunas (td)
		linha.insertCell(0).innerHTML = `${d.dia} / ${d.mes}  / ${d.ano}`
		
		//ajustando tipo
		switch(d.tipo){
			case '1': d.tipo = 'Alimentação'
				break
			case '2': d.tipo = 'Educação'
				break
			case '3': d.tipo = 'Lazer'
				break
			case '4': d.tipo = 'Saude'
				break
			case '5': d.tipo = 'Transporte'
				break
		}
		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor

		//criando o botão delete
		let btn = document.createElement("button")
		btn.className = 'btm btn-danger'
		btn.innerHTML = '<i class="fas fa-trash-alt"></i>'
		btn.id = `id_despesa_${d.id}`
		//adiconando função de remover despesa
		btn.onclick = function(){
			let id = this.id.replace('id_despesa_', '')
			bd.remover(id)
			alert('Registro removido')
			window.location.reload()
		}
		linha.insertCell(4).append(btn)
		
	})
}

function pesquisarDespesa(){
	let ano = document.getElementById('ano').value
	let mes = document.getElementById('mes').value
	let dia = document.getElementById('dia').value
	let tipo = document.getElementById('tipo').value
	let descricao = document.getElementById('descricao').value
	let valor = document.getElementById('valor').value

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
	
	//atribuindo o retorno do metódo pesquisar a variável despesas
	let despesas = bd.pesquisar(despesa)	
	carregarListaDespesas(despesas, true)
}