let chas = function( nombreFuncion = "none", args = [] ) {

    this.checkArgs = ( args, message ) => {
        if ( !Array.isArray( args ) ) {
            throw new Error('Arguments must be an array.');
        }
        else if ( !args.length ) {
            throw new Error( message );
        } 
    }

    // Aquí irán las diferentes categorías de funciones (propiedades de objeto), que a su vez pueden estar divididas en más categorías (propiedades de objeto)
    this.cat = {
        
        validation : {

            validateDNI : ( args = [] ) => {

                // Esta función es válida para la comprobación de NIFs

                this.checkArgs( args, "Please provide a DNI number." );

                let dni = args[0].toUpperCase();

                let letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
                let dniRegex = /^\d{8}[A-Z]$/;
                
                // Verificar el formato del DNI
                if (!dniRegex.test( dni )) {
                    return false;
                }
                
                // Obtener el número y la letra del DNI
                let numDNI = dni.substr(0, 8);
                let letraDNI = dni.substr(8, 1);
                
                // Calcular el carácter de control esperado
                let resto = parseInt(numDNI) % 23;
                let letraEsperada = letras.charAt(resto);
                
                // Comparar la letra del DNI con la letra esperada
                if (letraDNI !== letraEsperada) {
                    return false;
                }
                
                return true;

            },

            validateNIE : ( args = [] ) => {

                this.checkArgs( args, "Please provide a NIE number." );

                let nie = args[0].toUpperCase();

                let letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
                let nieRegex = /^[XYZ]\d{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/;
                
                // Verificar el formato del NIE
                if (!nieRegex.test(nie)) {
                    return false;
                }
                
                // Obtener el primer carácter y el número del NIE
                let primerCaracter = nie.charAt(0);
                let numNIE = nie.substr(1, 7);
                
                // Mapear el primer carácter a un número
                let numInicial;
                switch (primerCaracter) {
                    case 'X':
                    numInicial = 0;
                    break;
                    case 'Y':
                    numInicial = 1;
                    break;
                    case 'Z':
                    numInicial = 2;
                    break;
                }
                
                // Calcular el carácter de control esperado
                let numCompleto = numInicial.toString() + numNIE;
                let resto = parseInt(numCompleto) % 23;
                let letraEsperada = letras.charAt(resto);
                
                // Obtener la letra del NIE
                let letraNIE = nie.substr(8, 1);
                
                // Comparar la letra del NIE con la letra esperada
                if (letraNIE !== letraEsperada) {
                    return false;
                }
                
                return true;

            },


            
        },
        generation : {
            generateDNI : () => {

                let digitos = '0123456789';
                let letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
                let numDNI = '';
                
                for (let i = 0; i < 8; i++) {
                    numDNI += digitos.charAt( Math.floor(Math.random() * digitos.length) );
                }
                
                numDNI += letras.charAt( parseInt(numDNI) % 23 );
                
                return numDNI;
            }
        },
        none : () => {

            return "Say something!";

        },
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
                    result = objeto[propiedad]( args );
                    // console.log( objeto[propiedad]() );
                    // return console.log(propiedad + ': ' + 'Es función!!');

                }

            }
        }
    }
    recorrerPropiedades( this.cat );

    return result;
 
}

/* Hay dos formas se usar la función:
*  a) Como función, pasándole como primer argumento el nombre de la función o propiedad a utilizar y como segundo argumento (optativo) un array con argumentos de entrada de tal función.
*  b) Crear una instancia de la función (a modo de objeto) y acceder a su función o propiedad directamente; para esto debe conocerse la estructura/categorización de la librería.
*/
console.log( "Result: ", chas() );

console.log( "NIE validation (tipo acceso 1) for 'Y8237411K': ", chas( "validateNIE", ["Y8237411K"] ) );

console.log( "DNI generado: ", chas( "generateDNI" ) );

let ch = new chas;
console.log( "NIE validation (tipo acceso 2) for 'y8237411l': ", ch.cat.validation.validateNIE( ["y8237411k"] ) );
