let chas = function( nombreFuncion = "none" ) {

    // Aquí irán las diferentes categorías de funciones (propiedades de objeto), que a su vez pueden estar divididas en más categorías (propiedades de objeto)
    this.categoria = {
        
        subcategoria1 : {
            subcategoria : () => {
                return "subcategoria";
            },
            respuestaBase : () => {
                return "Hola, Mundo";
            },
            
            subcategoria1 : {
                none : () => {
                    return "Say something!";
                },
            }
        },
        subcategoria2 : {
            subcategoria2 : () => {
                return "subcategoria 2";
            },
            respuestaBase2 : () => {
                return "Hola, Mundo 2";
            }
        }
    };
    

    // Recorremos las propiedades del objeto en busca de la función deseada

    let found = false;
    let result = null;

    function recorrerPropiedades(objeto) {
        for (var propiedad in objeto) {

            // Si ya hemos encontrado la función salimos del bucle
            if ( found ) {
                return result;
            }
                

            if (objeto.hasOwnProperty(propiedad)) {

                // console.log(propiedad + ': ' + objeto[propiedad]);

                if (typeof objeto[propiedad] === 'object') {
                    recorrerPropiedades(objeto[propiedad]); // Llamada recursiva para recorrer las propiedades de los subobjetos
                }
                else if ( typeof objeto[propiedad] === 'function' && propiedad == nombreFuncion ) {

                    found = true;
                    result = objeto[propiedad]();
                    // console.log( objeto[propiedad]() );
                    // return console.log(propiedad + ': ' + 'Es función!!');

                }

            }
        }
    }
    recorrerPropiedades( this.categoria );

    return result;
 
}

// Llamamos a la función global
let result = chas();
console.log( "Result: ", result );