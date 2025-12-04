function rnd(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function format(num){ return num.match(/.{1,4}/g).join(" "); }

export function generateFakeCard(){
  let digits = "";
  for(let i=0;i<15;i++) digits += String(rnd(0,9));
  digits += "0"; // force invalid Luhn
  return {
    nome: "Teste Usuário",
    numero: format(digits),
    validade: `${String(rnd(1,12)).padStart(2,"0")}/${String(rnd(24,30))}`,
    cvv: String(rnd(100,999))
  };
}

export const sampleFakeCards = [
  { nome:"Teste Demo", numero:"4242 4242 4242 4242", validade:"12/29", cvv:"123" }
];
