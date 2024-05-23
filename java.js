joueuractuel = 'Bleu'; // Joueur actuel
scorebleu = 0; // Score du joueur bleu
scorerouge = 0; // Score du joueur rouge
gameGridValues = Array.from({ length: 10 }, () => null);

const conditiongagnant = [
    [1, 2, 3], [4, 5, 6], [7, 8, 9], // lignes
    [1, 4, 7], [2, 5, 8], [3, 6, 9], // colonnes
    [1, 5, 9], [3, 5, 7] // diagonales
];


function fctClick(index,monDiv) {
	if (gameGridValues[index] === null) { 
        gameGridValues[index] = joueuractuel;
		monDiv.style.backgroundColor = 'blue';
		gagne=0;
		robotLog='🤖 : Ok, le bleu a joué sur la case '+index+'<BR>';
		if (verifgagnantColor('Bleu')) {
			document.getElementById('aquiletour').innerHTML = "Bravo Mr Blue +1 ! Nettoie la grille pour jouer la partie suivante";
			robotLog='🤖 : Bien joué le bleu... 😡<BR>';
			gagne=1;
			scorebleu++;
			affichescore();
		}

		// Au tour du robot rouge
		// Indices qui sont encore null (en excluant l'indice 0)
		let nullIndices = gameGridValues
		.map((value, index) => value === null && index !== 0 ? index : null)
		.filter(index => index !== null);

		const nombreElements = nullIndices.length;
		robotLog+='🤖 : Je vois '+nombreElements+' cases possibles pour moi<BR>';
		if (nombreElements>0 && gagne==0) {

			indexCible = null;
			console.log(` =========== Robot Time ! =========== `);
			// Test si le rouge peut gagner
			if (indexCible == null) {			
				for (const nullIndex of nullIndices) {
					gameGridValues[nullIndex] = 'Rouge'; // Assigner temporairement le joueur actuel à l'index nul
					if (verifgagnant('Rouge')) {
						console.log(`Le joueur Rouge peut gagner en choisissant l'index ${nullIndex}.`);
						robotLog+='🤖 : Je peux gagner direct en choisissant l\'index '+nullIndex+', je gagne !<BR>';
						document.getElementById('aquiletour').innerHTML = 'Tu n\'as pas vu ?';
						indexCible = nullIndex;
						// Si le joueur peut gagner avec cet index, vous pouvez effectuer les actions nécessaires ici
					}
					gameGridValues[nullIndex] = null; // Rétablir la valeur nulle à l'index
				}
			}
			// Test si le Bleu va gagner
			if (indexCible == null) {
				console.log(`Pas de case gagnante, on cherche si le bleu peut gagner...`);
				for (const nullIndex of nullIndices) {
					gameGridValues[nullIndex] = 'Bleu'; // Assigner temporairement le joueur actuel à l'index nul
					if (verifgagnant('Bleu')) {
						console.log(`Le joueur Bleu peut gagner en choisissant l'index ${nullIndex}.`);
						robotLog+='🤖 : Tu peux gagner direct en choisissant l\'index '+nullIndex+', je te bloque !<BR>';
						document.getElementById('aquiletour').innerHTML = 'Tu crois que je n\'avais pas vu ?';
						indexCible = nullIndex;
						// Si le joueur peut gagner avec cet index, vous pouvez effectuer les actions nécessaires ici
					}
					gameGridValues[nullIndex] = null; // Rétablir la valeur nulle à l'index
				}
			}
	
	
// Sinon Recherche de la meilleur case
if (indexCible == null) {
	console.log(`on cherche la meilleur case...`);
	robotLog+='🤖 : Pas de danger, ni d\'opportunité directe de gagner... je cherche la meilleure case libre...<BR>';
	bestIndex = [];
	CombMax = 0;
	for (const nullIndex of nullIndices) { // Pour chaque case vide
		NbComb = 0;
		console.log(`Analyse pour indice ${nullIndex}`);
		for (const condition of conditiongagnant) { // Pour chaque combinaison gagnante
			const [a, b, c] = condition;
			if ((a==nullIndex) || (b==nullIndex) || (c==nullIndex)) {
				if ((gameGridValues[a] != 'Bleu') && (gameGridValues[b] != 'Bleu') && (gameGridValues[c] != 'Bleu')) {
					NbComb++;
					console.log(`Indice ${nullIndex} : ${NbComb} combinaisons trouvés (${a} ${b} ${c})`);
				}
			}

		}
		if (NbComb>=CombMax) {
			bestIndex = (NbComb === CombMax) ? [...bestIndex, nullIndex] : [nullIndex]
			CombMax = NbComb;
			console.log(`Pour l'indice ${nullIndex} : ${CombMax} combinaisons trouvés`);
			document.getElementById('aquiletour').innerHTML = CombMax+' combinaisons sur cette case !';
			robotLog+='🤖 : '+CombMax+' combinaisons sur la case '+nullIndex+'<BR>';
		}
	}
	console.log(`Je choisi au hasard parmis les ${bestIndex.length} meilleures combinaisons`);
	robotLog+='🤖 : Je choisi au hasard parmis les '+bestIndex.length+' meilleures combinaisons<BR>';
	indexCible = bestIndex[Math.floor(Math.random() * bestIndex.length)];
	robotLog+='🤖 : Je joue la case '+indexCible+' <BR>';
}
		
			// Sinon Recherche de la meilleur case
			if (indexCible == null) {
				// Choisir un index au hasard parmi les nullIndices
				let randomIndex = nullIndices[Math.floor(Math.random() * nullIndices.length)];
				document.getElementById('aquiletour').innerHTML = 'J\'ai choisi au hasard...';
				indexCible = randomIndex;
			}
			gameGridValues[indexCible] = 'Rouge';
			document.getElementById('Case'+indexCible).style.backgroundColor = 'red';
	
			if (verifgagnantColor('Rouge') && (gagne==0)) {
				document.getElementById('aquiletour').innerHTML = "Le robot rouge a gagné !<BR>(Nettoie la grille)";
				scorerouge++;
				affichescore();
			}

			

		} else {
			// Pas de cases libres... ou bleu a gagner
			if (nombreElements==0) {
				document.getElementById('aquiletour').innerHTML = "Cette partie est nulle 😁 !<BR>(Nettoie la grille)";
				robotLog+='🤖 : Pas de case à jouer pour moi...<BR>';
			}
			else {
				document.getElementById('aquiletour').innerHTML = "Bravo le bleu 👏 !<BR>(Nettoie la grille)";
			}

		}

	document.getElementById('robotLog').innerHTML = robotLog;


    } else {
        document.getElementById('aquiletour').innerHTML = "Cette case est malheureusement déjà prise!";
    }
}




function verifgagnant(joueuractuel) {
	
    for (const condition of conditiongagnant) {
		const[a, b, c]=condition;
		if ((gameGridValues[a] == joueuractuel) && (gameGridValues[b] == joueuractuel) && (gameGridValues[c] == joueuractuel))
		{
		return true;
		}
	}
	return false;
}

function verifgagnantColor(joueuractuel) {
	
    for (const condition of conditiongagnant) {
		const[a, b, c]=condition;
		if ((gameGridValues[a] == joueuractuel) && (gameGridValues[b] == joueuractuel) && (gameGridValues[c] == joueuractuel))
		{
			console.log(`jueur actuel ${joueuractuel} : ${a} ${b} ${c}`);
			if (joueuractuel=='Rouge') {
				document.getElementById('Case'+a).style.backgroundColor = '#8B0000';
				document.getElementById('Case'+b).style.backgroundColor = '#8B0000';
				document.getElementById('Case'+c).style.backgroundColor = '#8B0000';
			} else {
				document.getElementById('Case'+a).style.backgroundColor = '#00008B';
				document.getElementById('Case'+b).style.backgroundColor = '#00008B';
				document.getElementById('Case'+c).style.backgroundColor = '#00008B';		
			}

		return true;
		}
	}
	return false;
}


function clearGrid(){

	gameGridValues = Array.from({ length: 10 }, () => null);
		
	document.getElementById('Case1').style.backgroundColor = 'lightgreen';
	document.getElementById('Case2').style.backgroundColor = 'lightgreen';
	document.getElementById('Case3').style.backgroundColor = 'lightgreen';
	document.getElementById('Case4').style.backgroundColor = 'lightgreen';
	document.getElementById('Case5').style.backgroundColor = 'lightgreen';
	document.getElementById('Case6').style.backgroundColor = 'lightgreen';
	document.getElementById('Case7').style.backgroundColor = 'lightgreen';
	document.getElementById('Case8').style.backgroundColor = 'lightgreen';
	document.getElementById('Case9').style.backgroundColor = 'lightgreen';
	affichescore();
	document.getElementById('aquiletour').innerHTML = "Au tour du bleu";
	document.getElementById('robotLog').innerHTML = "🤖 : Vas y je suis chaud...";
}


function reinit(){

	clearGrid();
	scorebleu=0;
	scorerouge=0;
	affichescore();
	document.getElementById('aquiletour').innerHTML = "Scores à zéro.  Au tour du joueur "+joueuractuel;
	document.getElementById('robotLog').innerHTML = "🤖 : On préfère recommencer 🤣";
}

function affichescore(){
	document.getElementById('scorejoueurbleu').innerHTML ='Bleu: '+scorebleu;
	document.getElementById('scorejoueurrouge').innerHTML ='Rouge: '+scorerouge;
}
