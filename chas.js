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

        dates : {

            formatDate : ( args = [] ) => {

                this.checkArgs( args, "Please provide 3 input arguments: the date itself (e.g. 2023/6/8), the input mask (e.g. aaaa/mm/dd) and the output mask (e.g. mm-dd-aaaa)." );

                // Segunda capa de comprobación del array de argumentos de entrada
                if ( args.length != 3 && args.length != 4 ) {
                    throw new Error("Please provide 3 input arguments: the date itself (e.g. 2023/6/8), the input mask (e.g. aaaa/mm/dd) and the output mask (e.g. mm-dd-aaaa). 4th argument is optional and determines if padding is applied to months and days.");
                }

                let rawDate = args[0];
                let inputMask = args[1];
                let outputMask = args[2];
                let addPadding = false;

                if ( args.length == 4 )
                    addPadding = args[3];


                // Encuentra los separadores en las máscaras
                let inputSeparator = inputMask.match(/[^amd]/)[0];
                let outputSeparator = outputMask.match(/[^amd]/)[0];
                let outputMaskParts = outputMask.split(outputSeparator);

                // Descomponemos la fecha de entrada y la máscara de entrada en partes
                let rawDateParts = rawDate.split(inputSeparator);
                let inputMaskParts = inputMask.split(inputSeparator);

                // Creamos un objeto que mapea las partes de la fecha de entrada a su valor
                let dateMap = {};
                for (let i = 0; i < inputMaskParts.length; i++) {
                    dateMap[inputMaskParts[i]] = rawDateParts[i];
                }

                // Creamos la fecha de salida reemplazando las partes de la máscara de salida con los valores correspondientes
                let outputDateParts = outputMaskParts.map(function(part) {
                    if ( addPadding )
                        return dateMap[part] < 10 ? "0" + dateMap[part] : dateMap[part];
                    else
                        return dateMap[part];
                });

                // Unimos las partes de la fecha de salida con el separador de salida
                let outputDate = outputDateParts.join(outputSeparator);

                return outputDate;

            },

            dateToTimestamp : ( args = [] ) => {

                // Devuelve el timestamp en milisegundos de una fecha
                
                this.checkArgs( args, "Please provide 2 input arguments: the date itself (e.g. 2023/06/08) and the input mask (e.g. aaaa/mm/dd)." );

                // Segunda capa de comprobación del array de argumentos de entrada
                if ( args.length != 2 ) {
                    throw new Error("Please provide 2 input arguments: the date itself (e.g. 2023/06/08) and the input mask (e.g. aaaa/mm/dd).");
                }

                let rawDate = args[0];
                let inputMask = args[1];
                
                // Encuentra el separador en la máscara de entrada
                let inputSeparator = inputMask.match(/[^a]/)[0];
            
                // Descomponemos la fecha de entrada y la máscara de entrada en partes
                let rawDateParts = rawDate.split(inputSeparator);
                let inputMaskParts = inputMask.split(inputSeparator);
            
                // Creamos un objeto que mapea las partes de la fecha de entrada a su valor
                let dateMap = {};
                for (let i = 0; i < inputMaskParts.length; i++) {
                    dateMap[inputMaskParts[i]] = rawDateParts[i];
                }
            
                // Creamos un objeto Date usando los valores mapeados
                let date = new Date(dateMap['aaaa'], dateMap['mm'] - 1, dateMap['dd']);
            
                // Obtenemos el timestamp en milisegundos
                let timestamp = date.getTime();
            
                return timestamp;
            },

        },
        
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

            checkString : ( args = [] ) => {

                this.checkArgs( args, "Please provide a string. Optionally, you can add the minimum and maximum number of chars." );

                // Segunda capa de comprobación del array de argumentos de entrada
                if ( args.length > 3 ) {
                    throw new Error("Please provide a maximum of 3 input arguments: the string, the min. nº of chars (optional) and the max. nº of chars (optional).");
                }

                let str = args[0];
                let minChars = undefined || args[1];
                let maxChars = undefined || args[2];
                let validString = true;

                if ( typeof str != 'string' ) {
                    validString = false;
                }
                
                if ( minChars )
                    if ( str.length < minChars )
                        validString = false;
                
                if ( maxChars )
                    if ( str.length > maxChars )
                        validString = false;

                return validString;

            }

            
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

        convert : {

            celsiusToFahrenheit : ( args = [] ) => {

                this.checkArgs( args, "Please provide an input value." );

                let celsius = args[0];

                return celsius * 9/5 + 32;

            },

            fahrenheitToCelsius : ( args = [] ) => {

                this.checkArgs( args, "Please provide an input value." );

                let fahrenheit = args[0];

                return (fahrenheit - 32) * 5/9;

            },

            degreesToRadians : ( args = [] ) => {

                this.checkArgs( args, "Please provide an input value." );

                let degrees = args[0];

                return degrees * (Math.PI / 180);

            },

            radiansToDegrees : ( args = [] ) => {

                this.checkArgs( args, "Please provide an input value." );

                let radians = args[0];

                return radians * (180 / Math.PI);

            },


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

// Modo a)
let celsius = chas( "degreesToRadians", [180]);
console.log( "myCheck: ", celsius );

// Modo b)
let ch = new chas;
// console.log( "NIE validation (tipo acceso 2) for 'y8237411l': ", ch.cat.validation.validateNIE( ["y8237411l"] ) );
