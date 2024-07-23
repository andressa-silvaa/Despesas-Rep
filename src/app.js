class Despesa{
    constructor(data, tipo, descricao, valor){
        this.data = data;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }
    validarFormulario() {
		for(let i in this) {
			if(this[i] == undefined || this[i] == "" || this[i] == null) {
				return false
			}
		}
		return true
	}

}

class Bd{
    constructor(){
        let id = localStorage.getItem('id');
        if(id == null){
            localStorage.setItem('id',0);
        }
    }
    proximoId(){
        let proximoId = localStorage.getItem('id');
        return parseInt(proximoId) + 1;
    }
    cadastrarDespesa(){
        let data = document.getElementById('dataDespesa').value;
        let tipo = document.getElementById('tipo').value;
        let descricao = document.getElementById('descricao').value;
        let valor = document.getElementById('valor').value;
        let despesa = new Despesa(data,tipo,descricao,valor);
        if (despesa.validarFormulario()){

            this.gravarDespesa(despesa);
            document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
            document.getElementById('modal_titulo_div').className = 'modal-header text-success'
            document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
            document.getElementById('modal_btn').innerHTML = 'Voltar'
            document.getElementById('modal_btn').className = 'btn btn-success' 
            //dialog de sucesso
            $('#modalRegistraDespesa').modal('show')
            document.getElementById('dataDespesa').value = null;
            document.getElementById('tipo').value = null;
            document.getElementById('descricao').value = null;
            document.getElementById('valor').value = null;

        }else{

            document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
            document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
            document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!'
            document.getElementById('modal_btn').innerHTML = 'Corrigir'
            document.getElementById('modal_btn').className = 'btn btn-danger'
            //dialog de erro
            $('#modalRegistraDespesa').modal('show') 
        }
        
    }
    gravarDespesa(despesa){
        let proximoId = this.proximoId();
        localStorage.setItem(proximoId,JSON.stringify(despesa));
        localStorage.setItem('id',proximoId);
    }
    buscarDespesa(despesa){
        let despesasFiltradas = Array()
		despesasFiltradas = this.recuperarTodosRegistros()

		if(despesa.data != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.data == despesa.data)
		}
		if(despesa.tipo != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
		}
		if(despesa.descricao != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
		}
		if(despesa.valor != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
		}

		return despesasFiltradas
        

    }

    consultarDespesa(){
        let data  = document.getElementById("dataDespesa").value
        let tipo = document.getElementById("tipo").value
        let descricao = document.getElementById("descricao").value
        let valor = document.getElementById("valor").value
        let despesa = new Despesa(data, tipo, descricao, valor)
        let despesas = this.buscarDespesa(despesa) 
        this.carregaTabelaDespesas(despesas, true)
    }
	removerDespesa(id){
		localStorage.removeItem(id)
	}
    recuperarTodosRegistros() {
		let despesas = Array()
		let id = localStorage.getItem('id')
		for(let i = 1; i <= id; i++) {
			let despesa = JSON.parse(localStorage.getItem(i))
			if(despesa == null) {
				continue
			}
			despesa.id = i
			despesas.push(despesa)
		}
		return despesas.filter(d => d.data != "" || d.tipo != "" || d.descricao != "" || d.valor != "");
	}
    carregaTabelaDespesas(despesas = Array(), filtro = false) {

        if(despesas.length == 0 && filtro == false){
            despesas = this.recuperarTodosRegistros() 
        }  

        let listaDespesas = document.getElementById("listaDespesas")
        listaDespesas.innerHTML = ''
        despesas.forEach(function(despesa){
            //tr
            var linha = listaDespesas.insertRow();
            //td
            linha.insertCell(0).innerHTML = despesa.data 
            switch(despesa.tipo){
                case '1': despesa.tipo = 'Alimentação'
                    break
                case '2': despesa.tipo = 'Educação'
                    break
                case '3': despesa.tipo = 'Lazer'
                    break
                case '4': despesa.tipo = 'Saúde'
                    break
                case '5': despesa.tipo = 'Transporte'
                    break
                case '6': despesa.tipo = 'Outros gastos'
                
            }
            linha.insertCell(1).innerHTML = despesa.tipo
            linha.insertCell(2).innerHTML = despesa.descricao
            linha.insertCell(3).innerHTML = 'R$ ' + despesa.valor

            let btn = document.createElement('button')
            btn.className = 'btn btn-danger'
            btn.innerHTML = '<i class="fas fa-trash"  ></i>'
            btn.id = `id_despesa_${despesa.id}`
            btn.onclick = function(){
                let id = this.id.replace('id_despesa_','')
                bd.removerDespesa(id)
                window.location.reload()
            }
            linha.insertCell(4).append(btn)

            })
    
     }
    
}

// Instanciando a classe Bd
const bd = new Bd();