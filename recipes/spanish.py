"""
Authentic Spanish recipes collection.

40 traditional dishes spanning tapas, paellas, main courses, soups,
seafood, desserts, and sides from the diverse regions of Spain.
"""

recipes = [
    # =========================================================================
    # TAPAS
    # =========================================================================
    {
        "name": "Patatas Bravas",
        "description": "Crispy fried potato cubes served with a spicy smoky tomato sauce and garlic aioli, one of Spain's most beloved tapas.",
        "origin": "Spanish",
        "dietary": ["vegan", "gluten-free", "dairy-free", "nut-free", "halal"],
        "prep_time_minutes": 15,
        "cook_time_minutes": 35,
        "servings": 4,
        "difficulty": "easy",
        "ingredients": [
            {"name": "potatoes", "quantity": 800, "unit": "g", "category": "produce"},
            {"name": "olive oil", "quantity": 200, "unit": "ml", "category": "condiments"},
            {"name": "tomato passata", "quantity": 200, "unit": "ml", "category": "pantry"},
            {"name": "smoked paprika", "quantity": 2, "unit": "tsp", "category": "spices"},
            {"name": "hot paprika", "quantity": 1, "unit": "tsp", "category": "spices"},
            {"name": "garlic cloves", "quantity": 3, "unit": "pcs", "category": "produce"},
            {"name": "sherry vinegar", "quantity": 1, "unit": "tbsp", "category": "condiments"},
            {"name": "salt", "quantity": 1, "unit": "tsp", "category": "spices"},
            {"name": "cayenne pepper", "quantity": 0.5, "unit": "tsp", "category": "spices"}
        ],
        "instructions": [
            "Peel the potatoes and cut into rough 3cm cubes.",
            "Heat olive oil in a deep pan to 180C and fry potatoes in batches until golden and crispy, about 8-10 minutes per batch.",
            "For the bravas sauce, saute minced garlic in 2 tablespoons olive oil until fragrant.",
            "Add smoked paprika, hot paprika, and cayenne, stir for 30 seconds, then add tomato passata and sherry vinegar.",
            "Simmer the sauce for 15 minutes until thickened, then season with salt.",
            "Drain the fried potatoes on paper towels and season with salt.",
            "Pile the potatoes on a plate and drizzle generously with the bravas sauce.",
            "Serve immediately while hot and crispy."
        ]
    },
    {
        "name": "Gambas al Ajillo",
        "description": "Sizzling garlic shrimp cooked in abundant olive oil with dried chili, a classic tapa served bubbling hot in a cazuela.",
        "origin": "Spanish",
        "dietary": ["pescatarian", "gluten-free", "dairy-free", "nut-free", "low-carb", "keto"],
        "prep_time_minutes": 10,
        "cook_time_minutes": 8,
        "servings": 4,
        "difficulty": "easy",
        "ingredients": [
            {"name": "large prawns", "quantity": 500, "unit": "g", "category": "seafood"},
            {"name": "extra virgin olive oil", "quantity": 150, "unit": "ml", "category": "condiments"},
            {"name": "garlic cloves", "quantity": 8, "unit": "pcs", "category": "produce"},
            {"name": "dried guindilla chili", "quantity": 2, "unit": "pcs", "category": "spices"},
            {"name": "flat-leaf parsley", "quantity": 15, "unit": "g", "category": "produce"},
            {"name": "sea salt", "quantity": 1, "unit": "tsp", "category": "spices"},
            {"name": "crusty bread", "quantity": 200, "unit": "g", "category": "bakery"}
        ],
        "instructions": [
            "Peel and devein the prawns, leaving the tails intact, and pat dry with paper towels.",
            "Thinly slice the garlic cloves and finely chop the parsley.",
            "Heat the olive oil in a cazuela or small heavy skillet over medium-high heat.",
            "Add the sliced garlic and broken dried chili pieces, cooking for 1 minute until garlic just begins to turn golden.",
            "Add the prawns in a single layer and cook for 2 minutes per side until pink and curled.",
            "Remove from heat, season with sea salt, and scatter with chopped parsley.",
            "Serve immediately in the cazuela with plenty of crusty bread for dipping in the garlicky oil."
        ]
    },
    {
        "name": "Croquetas de Jamon",
        "description": "Creamy bechamel croquettes studded with Serrano ham, coated in breadcrumbs and fried until golden, a beloved Spanish bar snack.",
        "origin": "Spanish",
        "dietary": ["nut-free"],
        "prep_time_minutes": 30,
        "cook_time_minutes": 40,
        "servings": 6,
        "difficulty": "medium",
        "ingredients": [
            {"name": "Serrano ham", "quantity": 150, "unit": "g", "category": "meat"},
            {"name": "whole milk", "quantity": 500, "unit": "ml", "category": "dairy"},
            {"name": "butter", "quantity": 60, "unit": "g", "category": "dairy"},
            {"name": "plain flour", "quantity": 60, "unit": "g", "category": "pantry"},
            {"name": "onion", "quantity": 1, "unit": "pcs", "category": "produce"},
            {"name": "nutmeg", "quantity": 0.5, "unit": "tsp", "category": "spices"},
            {"name": "eggs", "quantity": 2, "unit": "pcs", "category": "dairy"},
            {"name": "breadcrumbs", "quantity": 150, "unit": "g", "category": "bakery"},
            {"name": "olive oil for frying", "quantity": 500, "unit": "ml", "category": "condiments"},
            {"name": "salt", "quantity": 0.5, "unit": "tsp", "category": "spices"},
            {"name": "white pepper", "quantity": 0.25, "unit": "tsp", "category": "spices"}
        ],
        "instructions": [
            "Finely dice the onion and Serrano ham into very small pieces.",
            "Melt butter in a saucepan, saute the onion until soft, then add the diced ham and cook for 2 minutes.",
            "Add the flour and stir constantly for 2 minutes to cook the roux.",
            "Gradually add the milk, stirring continuously to avoid lumps, and cook until the bechamel is very thick and pulls away from the sides of the pan.",
            "Season with nutmeg, salt, and white pepper, then spread onto a tray, cover with cling film touching the surface, and refrigerate for at least 3 hours.",
            "Shape the chilled mixture into small oval croquettes, dip in beaten egg, then coat in breadcrumbs.",
            "Deep-fry in olive oil at 180C for 2-3 minutes until deep golden brown.",
            "Drain on paper towels and serve hot."
        ]
    },
    {
        "name": "Tortilla Espanola",
        "description": "The iconic Spanish potato omelette made with thinly sliced potatoes and onion slowly cooked in olive oil, a staple served at room temperature.",
        "origin": "Spanish",
        "dietary": ["vegetarian", "gluten-free", "nut-free", "halal"],
        "prep_time_minutes": 15,
        "cook_time_minutes": 40,
        "servings": 6,
        "difficulty": "medium",
        "ingredients": [
            {"name": "potatoes", "quantity": 700, "unit": "g", "category": "produce"},
            {"name": "eggs", "quantity": 6, "unit": "pcs", "category": "dairy"},
            {"name": "onion", "quantity": 1, "unit": "pcs", "category": "produce"},
            {"name": "extra virgin olive oil", "quantity": 250, "unit": "ml", "category": "condiments"},
            {"name": "salt", "quantity": 1, "unit": "tsp", "category": "spices"}
        ],
        "instructions": [
            "Peel and thinly slice the potatoes into 3mm rounds, then thinly slice the onion.",
            "Heat the olive oil in a deep skillet over medium heat and gently cook the potatoes and onion for 20-25 minutes, stirring occasionally, until very tender but not browned.",
            "Beat the eggs in a large bowl with salt.",
            "Drain the potatoes and onion, reserving the oil, and fold them into the beaten eggs, letting the mixture rest for 5 minutes.",
            "Heat 2 tablespoons of the reserved oil in a non-stick skillet over medium-high heat and pour in the egg and potato mixture.",
            "Cook for 4-5 minutes until the edges are set, then place a plate over the pan and flip the tortilla onto it.",
            "Slide the tortilla back into the pan and cook for another 3-4 minutes until just set but still slightly juicy inside.",
            "Let it rest for 5 minutes before slicing into wedges and serving at room temperature."
        ]
    },
    {
        "name": "Pimientos de Padron",
        "description": "Small green Padron peppers blistered in olive oil and finished with coarse sea salt, where most are mild but some are fiery hot.",
        "origin": "Spanish",
        "dietary": ["vegan", "gluten-free", "dairy-free", "nut-free", "low-carb", "keto", "halal"],
        "prep_time_minutes": 5,
        "cook_time_minutes": 5,
        "servings": 4,
        "difficulty": "easy",
        "ingredients": [
            {"name": "Padron peppers", "quantity": 300, "unit": "g", "category": "produce"},
            {"name": "extra virgin olive oil", "quantity": 3, "unit": "tbsp", "category": "condiments"},
            {"name": "flaky sea salt", "quantity": 1, "unit": "tsp", "category": "spices"}
        ],
        "instructions": [
            "Wash the Padron peppers and pat them completely dry with paper towels.",
            "Heat the olive oil in a large skillet over high heat until shimmering and almost smoking.",
            "Add the peppers in a single layer and cook without moving for 1-2 minutes until blistered and charred on one side.",
            "Toss the peppers and continue cooking for another 1-2 minutes until blistered all over and softened.",
            "Transfer to a serving plate and generously sprinkle with flaky sea salt.",
            "Serve immediately while hot."
        ]
    },
    {
        "name": "Boquerones en Vinagre",
        "description": "Fresh anchovies marinated in white wine vinegar, garlic, and parsley, a refreshing cold tapa found in bars across Spain.",
        "origin": "Spanish",
        "dietary": ["pescatarian", "gluten-free", "dairy-free", "nut-free", "low-carb", "keto"],
        "prep_time_minutes": 30,
        "cook_time_minutes": 0,
        "servings": 4,
        "difficulty": "medium",
        "ingredients": [
            {"name": "fresh anchovies", "quantity": 500, "unit": "g", "category": "seafood"},
            {"name": "white wine vinegar", "quantity": 200, "unit": "ml", "category": "condiments"},
            {"name": "garlic cloves", "quantity": 4, "unit": "pcs", "category": "produce"},
            {"name": "flat-leaf parsley", "quantity": 20, "unit": "g", "category": "produce"},
            {"name": "extra virgin olive oil", "quantity": 80, "unit": "ml", "category": "condiments"},
            {"name": "sea salt", "quantity": 1, "unit": "tsp", "category": "spices"}
        ],
        "instructions": [
            "Clean the anchovies by removing the heads, guts, and backbone, separating them into two fillets each.",
            "Rinse the fillets under cold water and pat dry.",
            "Lay the fillets skin-side down in a shallow dish and cover completely with white wine vinegar.",
            "Refrigerate and marinate for at least 6 hours or overnight until the flesh turns white and opaque.",
            "Drain the vinegar, finely mince the garlic, and chop the parsley.",
            "Arrange the marinated anchovies on a plate, drizzle generously with olive oil, and scatter with garlic, parsley, and sea salt.",
            "Serve cold as a tapa with crusty bread."
        ]
    },
    {
        "name": "Albondigas en Salsa",
        "description": "Tender Spanish meatballs simmered in a rich tomato and saffron sauce, a comforting tapa or main dish served throughout Spain.",
        "origin": "Spanish",
        "dietary": ["nut-free"],
        "prep_time_minutes": 25,
        "cook_time_minutes": 35,
        "servings": 6,
        "difficulty": "medium",
        "ingredients": [
            {"name": "ground pork", "quantity": 300, "unit": "g", "category": "meat"},
            {"name": "ground beef", "quantity": 200, "unit": "g", "category": "meat"},
            {"name": "breadcrumbs", "quantity": 50, "unit": "g", "category": "bakery"},
            {"name": "egg", "quantity": 1, "unit": "pcs", "category": "dairy"},
            {"name": "garlic cloves", "quantity": 4, "unit": "pcs", "category": "produce"},
            {"name": "flat-leaf parsley", "quantity": 15, "unit": "g", "category": "produce"},
            {"name": "onion", "quantity": 1, "unit": "pcs", "category": "produce"},
            {"name": "crushed tomatoes", "quantity": 400, "unit": "g", "category": "pantry"},
            {"name": "white wine", "quantity": 100, "unit": "ml", "category": "beverages"},
            {"name": "saffron threads", "quantity": 0.5, "unit": "g", "category": "spices"},
            {"name": "smoked paprika", "quantity": 1, "unit": "tsp", "category": "spices"},
            {"name": "olive oil", "quantity": 60, "unit": "ml", "category": "condiments"},
            {"name": "plain flour", "quantity": 30, "unit": "g", "category": "pantry"},
            {"name": "salt", "quantity": 1, "unit": "tsp", "category": "spices"}
        ],
        "instructions": [
            "Combine the ground pork, ground beef, breadcrumbs, egg, half the minced garlic, chopped parsley, salt, and smoked paprika in a bowl and mix well.",
            "Shape the mixture into walnut-sized meatballs and dust lightly with flour.",
            "Heat olive oil in a large cazuela or deep skillet and brown the meatballs in batches, then set aside.",
            "In the same pan, saute the finely diced onion and remaining garlic until softened.",
            "Add the white wine and saffron threads, simmer for 2 minutes, then add the crushed tomatoes.",
            "Return the meatballs to the sauce, cover, and simmer gently for 25 minutes until cooked through and the sauce has thickened.",
            "Adjust seasoning with salt and garnish with fresh parsley.",
            "Serve hot with crusty bread to mop up the sauce."
        ]
    },
    {
        "name": "Pan con Tomate",
        "description": "Toasted bread rubbed with ripe tomato, garlic, and drizzled with olive oil, the simplest and most iconic Catalan tapa.",
        "origin": "Spanish",
        "dietary": ["vegan", "dairy-free", "nut-free", "halal"],
        "prep_time_minutes": 5,
        "cook_time_minutes": 5,
        "servings": 4,
        "difficulty": "easy",
        "ingredients": [
            {"name": "rustic bread", "quantity": 4, "unit": "slices", "category": "bakery"},
            {"name": "ripe tomatoes", "quantity": 3, "unit": "pcs", "category": "produce"},
            {"name": "garlic cloves", "quantity": 2, "unit": "pcs", "category": "produce"},
            {"name": "extra virgin olive oil", "quantity": 60, "unit": "ml", "category": "condiments"},
            {"name": "flaky sea salt", "quantity": 0.5, "unit": "tsp", "category": "spices"}
        ],
        "instructions": [
            "Toast or grill the bread slices until golden and crispy on both sides.",
            "Cut the garlic cloves in half and rub the cut side vigorously over the warm toast.",
            "Cut the tomatoes in half crosswise and grate the flesh on a box grater, discarding the skin.",
            "Spoon the fresh tomato pulp generously over each toast and spread evenly.",
            "Drizzle with good extra virgin olive oil and sprinkle with flaky sea salt.",
            "Serve immediately as a tapa or alongside cured meats and cheese."
        ]
    },
    {
        "name": "Pulpo a la Gallega",
        "description": "Galician-style octopus sliced and served on a wooden board with boiled potatoes, smoked paprika, coarse salt, and olive oil.",
        "origin": "Spanish",
        "dietary": ["pescatarian", "gluten-free", "dairy-free", "nut-free"],
        "prep_time_minutes": 15,
        "cook_time_minutes": 50,
        "servings": 4,
        "difficulty": "medium",
        "ingredients": [
            {"name": "octopus", "quantity": 1000, "unit": "g", "category": "seafood"},
            {"name": "potatoes", "quantity": 400, "unit": "g", "category": "produce"},
            {"name": "smoked paprika", "quantity": 2, "unit": "tsp", "category": "spices"},
            {"name": "extra virgin olive oil", "quantity": 60, "unit": "ml", "category": "condiments"},
            {"name": "coarse sea salt", "quantity": 1, "unit": "tsp", "category": "spices"},
            {"name": "bay leaves", "quantity": 2, "unit": "pcs", "category": "spices"}
        ],
        "instructions": [
            "If using fresh octopus, freeze it for at least 48 hours then thaw to tenderize the flesh.",
            "Bring a large pot of water to a boil with the bay leaves and dip the octopus in and out three times to curl the tentacles before fully submerging.",
            "Simmer the octopus for 40-50 minutes until tender when pierced with a knife.",
            "In the last 20 minutes of cooking, add peeled and sliced potatoes to the pot.",
            "Remove the octopus and let it rest for 5 minutes, then cut the tentacles into 1cm thick slices with scissors.",
            "Arrange the potato slices on a wooden board and layer the octopus slices on top.",
            "Drizzle generously with olive oil, sprinkle with smoked paprika and coarse sea salt.",
            "Serve warm on the wooden board as is traditional in Galicia."
        ]
    },
    # =========================================================================
    # PAELLA & RICE DISHES
    # =========================================================================
    {
        "name": "Paella Valenciana",
        "description": "The original Valencian paella made with chicken, rabbit, green beans, and lima beans cooked with saffron rice over an open flame.",
        "origin": "Spanish",
        "dietary": ["gluten-free", "dairy-free", "nut-free", "halal"],
        "prep_time_minutes": 30,
        "cook_time_minutes": 45,
        "servings": 6,
        "difficulty": "hard",
        "ingredients": [
            {"name": "bomba rice", "quantity": 400, "unit": "g", "category": "pantry"},
            {"name": "chicken thighs", "quantity": 500, "unit": "g", "category": "meat"},
            {"name": "rabbit pieces", "quantity": 400, "unit": "g", "category": "meat"},
            {"name": "green beans", "quantity": 200, "unit": "g", "category": "produce"},
            {"name": "lima beans", "quantity": 150, "unit": "g", "category": "produce"},
            {"name": "crushed tomatoes", "quantity": 100, "unit": "g", "category": "pantry"},
            {"name": "saffron threads", "quantity": 1, "unit": "g", "category": "spices"},
            {"name": "smoked paprika", "quantity": 1, "unit": "tsp", "category": "spices"},
            {"name": "garlic cloves", "quantity": 3, "unit": "pcs", "category": "produce"},
            {"name": "extra virgin olive oil", "quantity": 80, "unit": "ml", "category": "condiments"},
            {"name": "chicken stock", "quantity": 1200, "unit": "ml", "category": "pantry"},
            {"name": "fresh rosemary", "quantity": 2, "unit": "sprigs", "category": "produce"},
            {"name": "salt", "quantity": 1.5, "unit": "tsp", "category": "spices"},
            {"name": "lemon", "quantity": 1, "unit": "pcs", "category": "produce"}
        ],
        "instructions": [
            "Heat olive oil in a wide paella pan over high heat and brown the chicken and rabbit pieces on all sides, then set aside.",
            "In the same oil, saute the green beans for 3-4 minutes, then add minced garlic and grated tomato, cooking until the liquid evaporates.",
            "Add smoked paprika, stir for 30 seconds, then return the meat to the pan.",
            "Pour in the hot stock infused with saffron threads and rosemary, bring to a boil, and simmer for 20 minutes.",
            "Add the lima beans and scatter the bomba rice evenly across the pan without stirring.",
            "Cook over high heat for 10 minutes, then reduce to medium for another 8-10 minutes until the rice is cooked and the liquid is absorbed.",
            "Increase heat for the last 2 minutes to create the socarrat, the prized crispy rice layer on the bottom.",
            "Remove from heat, cover with a clean cloth, rest for 5 minutes, then serve with lemon wedges."
        ]
    },
    {
        "name": "Paella de Marisco",
        "description": "Luxurious seafood paella loaded with prawns, mussels, clams, and squid in a fragrant saffron rice cooked in fish stock.",
        "origin": "Spanish",
        "dietary": ["pescatarian", "gluten-free", "dairy-free", "nut-free"],
        "prep_time_minutes": 30,
        "cook_time_minutes": 40,
        "servings": 6,
        "difficulty": "hard",
        "ingredients": [
            {"name": "bomba rice", "quantity": 400, "unit": "g", "category": "pantry"},
            {"name": "large prawns", "quantity": 300, "unit": "g", "category": "seafood"},
            {"name": "mussels", "quantity": 300, "unit": "g", "category": "seafood"},
            {"name": "clams", "quantity": 250, "unit": "g", "category": "seafood"},
            {"name": "squid", "quantity": 200, "unit": "g", "category": "seafood"},
            {"name": "fish stock", "quantity": 1200, "unit": "ml", "category": "pantry"},
            {"name": "saffron threads", "quantity": 1, "unit": "g", "category": "spices"},
            {"name": "crushed tomatoes", "quantity": 150, "unit": "g", "category": "pantry"},
            {"name": "red bell pepper", "quantity": 1, "unit": "pcs", "category": "produce"},
            {"name": "garlic cloves", "quantity": 4, "unit": "pcs", "category": "produce"},
            {"name": "onion", "quantity": 1, "unit": "pcs", "category": "produce"},
            {"name": "extra virgin olive oil", "quantity": 80, "unit": "ml", "category": "condiments"},
            {"name": "lemon", "quantity": 1, "unit": "pcs", "category": "produce"},
            {"name": "flat-leaf parsley", "quantity": 15, "unit": "g", "category": "produce"},
            {"name": "salt", "quantity": 1, "unit": "tsp", "category": "spices"}
        ],
        "instructions": [
            "Heat olive oil in a paella pan and saute the diced onion and red pepper until softened.",
            "Add sliced squid rings and cook for 2 minutes, then add minced garlic and cook for another minute.",
            "Stir in the grated tomato and cook until the mixture darkens and the liquid evaporates.",
            "Add the bomba rice and stir to coat in the sofrito, then pour in the hot fish stock infused with saffron.",
            "Distribute the rice evenly, bring to a boil, then cook over medium-high heat for 10 minutes without stirring.",
            "Nestle the prawns, mussels, and clams into the rice and cook for another 8-10 minutes until the shellfish open and the rice is tender.",
            "Increase heat for the final 2 minutes to develop the socarrat.",
            "Remove from heat, discard any unopened shellfish, garnish with parsley, and serve with lemon wedges."
        ]
    },
    {
        "name": "Paella Mixta",
        "description": "A generous mixed paella combining chicken, chorizo, prawns, and mussels with saffron rice, popular in restaurants across Spain.",
        "origin": "Spanish",
        "dietary": ["gluten-free", "dairy-free", "nut-free"],
        "prep_time_minutes": 30,
        "cook_time_minutes": 45,
        "servings": 6,
        "difficulty": "hard",
        "ingredients": [
            {"name": "bomba rice", "quantity": 400, "unit": "g", "category": "pantry"},
            {"name": "chicken thighs", "quantity": 400, "unit": "g", "category": "meat"},
            {"name": "chorizo", "quantity": 150, "unit": "g", "category": "meat"},
            {"name": "large prawns", "quantity": 250, "unit": "g", "category": "seafood"},
            {"name": "mussels", "quantity": 250, "unit": "g", "category": "seafood"},
            {"name": "chicken stock", "quantity": 1200, "unit": "ml", "category": "pantry"},
            {"name": "saffron threads", "quantity": 1, "unit": "g", "category": "spices"},
            {"name": "onion", "quantity": 1, "unit": "pcs", "category": "produce"},
            {"name": "red bell pepper", "quantity": 1, "unit": "pcs", "category": "produce"},
            {"name": "garlic cloves", "quantity": 3, "unit": "pcs", "category": "produce"},
            {"name": "crushed tomatoes", "quantity": 150, "unit": "g", "category": "pantry"},
            {"name": "frozen peas", "quantity": 100, "unit": "g", "category": "frozen"},
            {"name": "extra virgin olive oil", "quantity": 80, "unit": "ml", "category": "condiments"},
            {"name": "smoked paprika", "quantity": 1, "unit": "tsp", "category": "spices"},
            {"name": "salt", "quantity": 1, "unit": "tsp", "category": "spices"}
        ],
        "instructions": [
            "Heat olive oil in a paella pan over high heat and brown the chicken pieces on all sides, then remove and set aside.",
            "Add sliced chorizo and cook until it releases its oils, then add diced onion, pepper, and garlic, sauteing until soft.",
            "Stir in the grated tomato and smoked paprika, cooking until the sofrito is thick and dark.",
            "Return the chicken to the pan, add the rice, and stir to coat everything in the sofrito.",
            "Pour in the hot saffron-infused stock, distribute everything evenly, and bring to a boil.",
            "Cook over medium-high heat for 10 minutes, then add the prawns and mussels, pressing them into the rice, along with the frozen peas.",
            "Continue cooking for 8-10 minutes until the rice is tender, the seafood is cooked, and the liquid is absorbed.",
            "Let the paella rest off the heat for 5 minutes before serving directly from the pan."
        ]
    },
    {
        "name": "Arroz Negro",
        "description": "Dramatic black rice cooked with squid ink, squid, and seafood stock, a specialty of the Spanish Mediterranean coast.",
        "origin": "Spanish",
        "dietary": ["pescatarian", "gluten-free", "dairy-free", "nut-free"],
        "prep_time_minutes": 20,
        "cook_time_minutes": 35,
        "servings": 4,
        "difficulty": "medium",
        "ingredients": [
            {"name": "bomba rice", "quantity": 300, "unit": "g", "category": "pantry"},
            {"name": "squid", "quantity": 400, "unit": "g", "category": "seafood"},
            {"name": "squid ink", "quantity": 8, "unit": "g", "category": "seafood"},
            {"name": "fish stock", "quantity": 900, "unit": "ml", "category": "pantry"},
            {"name": "onion", "quantity": 1, "unit": "pcs", "category": "produce"},
            {"name": "garlic cloves", "quantity": 3, "unit": "pcs", "category": "produce"},
            {"name": "crushed tomatoes", "quantity": 100, "unit": "g", "category": "pantry"},
            {"name": "extra virgin olive oil", "quantity": 60, "unit": "ml", "category": "condiments"},
            {"name": "white wine", "quantity": 100, "unit": "ml", "category": "beverages"},
            {"name": "alioli", "quantity": 80, "unit": "g", "category": "condiments"},
            {"name": "salt", "quantity": 1, "unit": "tsp", "category": "spices"}
        ],
        "instructions": [
            "Clean the squid, separating the tentacles from the bodies, and cut the bodies into rings.",
            "Heat olive oil in a paella pan and saute the diced onion until translucent, then add minced garlic.",
            "Add the squid rings and tentacles, cooking over high heat for 3 minutes.",
            "Pour in the white wine and let it reduce by half, then add the grated tomato and cook for 5 minutes.",
            "Dissolve the squid ink in the hot fish stock, add the rice to the pan, and pour in the inky stock.",
            "Stir once to distribute evenly, then cook over medium-high heat for 18-20 minutes without stirring until the rice is tender and liquid absorbed.",
            "Rest for 5 minutes off the heat.",
            "Serve the dramatic black rice with a generous dollop of alioli on top."
        ]
    },
    # =========================================================================
    # MAIN DISHES
    # =========================================================================
    {
        "name": "Cochinillo Asado",
        "description": "Roast suckling pig from Segovia, slow-roasted until the skin is impossibly crispy and the meat falls off the bone.",
        "origin": "Spanish",
        "dietary": ["gluten-free", "dairy-free", "nut-free", "low-carb", "keto"],
        "prep_time_minutes": 20,
        "cook_time_minutes": 180,
        "servings": 8,
        "difficulty": "hard",
        "ingredients": [
            {"name": "suckling pig half", "quantity": 3000, "unit": "g", "category": "meat"},
            {"name": "garlic cloves", "quantity": 8, "unit": "pcs", "category": "produce"},
            {"name": "extra virgin olive oil", "quantity": 100, "unit": "ml", "category": "condiments"},
            {"name": "white wine", "quantity": 200, "unit": "ml", "category": "beverages"},
            {"name": "bay leaves", "quantity": 4, "unit": "pcs", "category": "spices"},
            {"name": "fresh thyme", "quantity": 6, "unit": "sprigs", "category": "produce"},
            {"name": "sea salt", "quantity": 2, "unit": "tbsp", "category": "spices"},
            {"name": "black pepper", "quantity": 1, "unit": "tsp", "category": "spices"},
            {"name": "lard", "quantity": 50, "unit": "g", "category": "pantry"},
            {"name": "water", "quantity": 300, "unit": "ml", "category": "beverages"}
        ],
        "instructions": [
            "Score the skin of the suckling pig with a sharp knife in a crosshatch pattern.",
            "Rub the pig all over with olive oil, crushed garlic, salt, and pepper, and tuck bay leaves and thyme underneath.",
            "Place the pig skin-side down in a large roasting pan with the water and white wine.",
            "Roast at 180C for 1.5 hours, basting occasionally with the pan juices.",
            "Carefully flip the pig skin-side up, rub the skin with lard, and increase the oven to 220C.",
            "Roast for another 45-60 minutes until the skin is deeply golden and crackles when tapped.",
            "Rest the pig for 15 minutes before carving, traditionally done with the edge of a plate to show how tender the meat is.",
            "Serve with the crispy skin and pan juices spooned over."
        ]
    },
    {
        "name": "Fabada Asturiana",
        "description": "A hearty bean stew from Asturias made with large white fabes beans, chorizo, morcilla, and smoked pork, perfect for cold weather.",
        "origin": "Spanish",
        "dietary": ["gluten-free", "dairy-free", "nut-free"],
        "prep_time_minutes": 20,
        "cook_time_minutes": 150,
        "servings": 6,
        "difficulty": "medium",
        "ingredients": [
            {"name": "dried fabes beans", "quantity": 500, "unit": "g", "category": "pantry"},
            {"name": "chorizo", "quantity": 200, "unit": "g", "category": "meat"},
            {"name": "morcilla", "quantity": 200, "unit": "g", "category": "meat"},
            {"name": "smoked pork shoulder", "quantity": 300, "unit": "g", "category": "meat"},
            {"name": "onion", "quantity": 1, "unit": "pcs", "category": "produce"},
            {"name": "garlic cloves", "quantity": 3, "unit": "pcs", "category": "produce"},
            {"name": "saffron threads", "quantity": 0.5, "unit": "g", "category": "spices"},
            {"name": "bay leaves", "quantity": 2, "unit": "pcs", "category": "spices"},
            {"name": "smoked paprika", "quantity": 1, "unit": "tsp", "category": "spices"},
            {"name": "extra virgin olive oil", "quantity": 30, "unit": "ml", "category": "condiments"},
            {"name": "salt", "quantity": 1, "unit": "tsp", "category": "spices"}
        ],
        "instructions": [
            "Soak the fabes beans overnight in cold water, then drain and rinse.",
            "Place the beans in a large pot with the smoked pork shoulder, halved onion, whole garlic cloves, and bay leaves.",
            "Cover with cold water and bring slowly to a boil, skimming any foam from the surface.",
            "Reduce to a gentle simmer and cook for 1 hour, adding cold water as needed to keep the beans submerged.",
            "Add the whole chorizo and morcilla, along with saffron and smoked paprika, and continue simmering for another hour until beans are very tender and creamy.",
            "Remove the meats, slice them thickly, and return to the pot.",
            "Season with salt, let the fabada rest for 10 minutes off the heat so the flavors meld.",
            "Serve in deep bowls with the sliced meats on top of the beans and plenty of the rich broth."
        ]
    },
    {
        "name": "Pisto Manchego",
        "description": "A vegetable stew from La Mancha made with tomatoes, peppers, zucchini, and onion, similar to ratatouille but distinctly Spanish.",
        "origin": "Spanish",
        "dietary": ["vegan", "gluten-free", "dairy-free", "nut-free", "halal"],
        "prep_time_minutes": 15,
        "cook_time_minutes": 40,
        "servings": 4,
        "difficulty": "easy",
        "ingredients": [
            {"name": "ripe tomatoes", "quantity": 400, "unit": "g", "category": "produce"},
            {"name": "green bell pepper", "quantity": 2, "unit": "pcs", "category": "produce"},
            {"name": "red bell pepper", "quantity": 1, "unit": "pcs", "category": "produce"},
            {"name": "zucchini", "quantity": 2, "unit": "pcs", "category": "produce"},
            {"name": "onion", "quantity": 1, "unit": "pcs", "category": "produce"},
            {"name": "garlic cloves", "quantity": 3, "unit": "pcs", "category": "produce"},
            {"name": "extra virgin olive oil", "quantity": 80, "unit": "ml", "category": "condiments"},
            {"name": "salt", "quantity": 1, "unit": "tsp", "category": "spices"},
            {"name": "sugar", "quantity": 0.5, "unit": "tsp", "category": "pantry"}
        ],
        "instructions": [
            "Dice the onion, peppers, and zucchini into roughly 1cm cubes and keep them separate.",
            "Score and blanch the tomatoes, then peel and roughly chop them.",
            "Heat olive oil in a large skillet and cook the onion over low heat until very soft, about 10 minutes.",
            "Add the peppers and continue cooking gently for another 10 minutes.",
            "Add the diced zucchini and minced garlic, cooking for 5 more minutes.",
            "Add the chopped tomatoes, sugar, and salt, and simmer uncovered for 15-20 minutes until everything is soft and the sauce has thickened.",
            "Adjust seasoning and serve warm, at room temperature, or topped with a fried egg for a more substantial dish."
        ]
    },
    {
        "name": "Pollo al Ajillo",
        "description": "Chicken pieces braised with an abundance of garlic cloves in olive oil and white wine, a rustic dish found in every Spanish home kitchen.",
        "origin": "Spanish",
        "dietary": ["gluten-free", "dairy-free", "nut-free", "halal"],
        "prep_time_minutes": 10,
        "cook_time_minutes": 35,
        "servings": 4,
        "difficulty": "easy",
        "ingredients": [
            {"name": "chicken thighs and drumsticks", "quantity": 1000, "unit": "g", "category": "meat"},
            {"name": "garlic cloves", "quantity": 20, "unit": "pcs", "category": "produce"},
            {"name": "extra virgin olive oil", "quantity": 100, "unit": "ml", "category": "condiments"},
            {"name": "dry white wine", "quantity": 150, "unit": "ml", "category": "beverages"},
            {"name": "bay leaves", "quantity": 2, "unit": "pcs", "category": "spices"},
            {"name": "fresh thyme", "quantity": 4, "unit": "sprigs", "category": "produce"},
            {"name": "salt", "quantity": 1, "unit": "tsp", "category": "spices"},
            {"name": "black pepper", "quantity": 0.5, "unit": "tsp", "category": "spices"},
            {"name": "flat-leaf parsley", "quantity": 15, "unit": "g", "category": "produce"}
        ],
        "instructions": [
            "Season the chicken pieces generously with salt and pepper.",
            "Heat olive oil in a large skillet or cazuela over medium-high heat and brown the chicken on all sides until golden, about 8 minutes total.",
            "Remove the chicken and reduce the heat to medium, then add the whole peeled garlic cloves and fry gently until golden and fragrant.",
            "Pour in the white wine, scraping up any browned bits from the bottom, and add the bay leaves and thyme.",
            "Return the chicken to the pan, cover, and simmer gently for 25 minutes until the chicken is cooked through and the garlic is meltingly soft.",
            "Garnish with chopped parsley and serve with plenty of crusty bread to soak up the garlicky juices."
        ]
    },
    {
        "name": "Cordero al Chilindron",
        "description": "Aragonese braised lamb with a rich sauce of roasted red peppers, tomatoes, and chorizo, a festive dish from northeastern Spain.",
        "origin": "Spanish",
        "dietary": ["gluten-free", "dairy-free", "nut-free"],
        "prep_time_minutes": 20,
        "cook_time_minutes": 90,
        "servings": 6,
        "difficulty": "medium",
        "ingredients": [
            {"name": "lamb shoulder", "quantity": 1000, "unit": "g", "category": "meat"},
            {"name": "roasted red peppers", "quantity": 300, "unit": "g", "category": "produce"},
            {"name": "chorizo", "quantity": 100, "unit": "g", "category": "meat"},
            {"name": "onion", "quantity": 2, "unit": "pcs", "category": "produce"},
            {"name": "garlic cloves", "quantity": 4, "unit": "pcs", "category": "produce"},
            {"name": "crushed tomatoes", "quantity": 400, "unit": "g", "category": "pantry"},
            {"name": "Serrano ham", "quantity": 80, "unit": "g", "category": "meat"},
            {"name": "dry white wine", "quantity": 150, "unit": "ml", "category": "beverages"},
            {"name": "smoked paprika", "quantity": 1, "unit": "tsp", "category": "spices"},
            {"name": "extra virgin olive oil", "quantity": 60, "unit": "ml", "category": "condiments"},
            {"name": "salt", "quantity": 1, "unit": "tsp", "category": "spices"},
            {"name": "black pepper", "quantity": 0.5, "unit": "tsp", "category": "spices"}
        ],
        "instructions": [
            "Cut the lamb shoulder into large chunks and season with salt and pepper.",
            "Heat olive oil in a heavy casserole and brown the lamb in batches over high heat, then set aside.",
            "Add diced chorizo and Serrano ham to the pot and cook for 2 minutes until the fat renders.",
            "Add sliced onions and garlic, cooking until softened, then stir in smoked paprika.",
            "Pour in the white wine and let it reduce by half, then add crushed tomatoes and sliced roasted peppers.",
            "Return the lamb to the pot, cover tightly, and braise in a 160C oven for 1.5 hours until the meat is fork-tender.",
            "Adjust seasoning and let rest for 10 minutes before serving.",
            "Serve in the casserole with the rich red pepper sauce spooned generously over the lamb."
        ]
    },
    {
        "name": "Bacalao al Pil Pil",
        "description": "Salt cod gently cooked in olive oil with garlic, creating a silky emulsified sauce through the fish's natural gelatin, a Basque masterpiece.",
        "origin": "Spanish",
        "dietary": ["pescatarian", "gluten-free", "dairy-free", "nut-free", "low-carb"],
        "prep_time_minutes": 20,
        "cook_time_minutes": 25,
        "servings": 4,
        "difficulty": "hard",
        "ingredients": [
            {"name": "salt cod fillets", "quantity": 600, "unit": "g", "category": "seafood"},
            {"name": "extra virgin olive oil", "quantity": 250, "unit": "ml", "category": "condiments"},
            {"name": "garlic cloves", "quantity": 6, "unit": "pcs", "category": "produce"},
            {"name": "dried guindilla chili", "quantity": 2, "unit": "pcs", "category": "spices"},
            {"name": "flat-leaf parsley", "quantity": 10, "unit": "g", "category": "produce"}
        ],
        "instructions": [
            "Desalt the cod by soaking in cold water for 48 hours, changing the water 3-4 times, then pat dry.",
            "Place the cod skin-side down in a cold cazuela, pour the olive oil over, and place on the lowest possible heat.",
            "Cook very gently for 15-18 minutes, swirling the pan occasionally, until the fish is cooked through and begins to release its gelatin into the oil.",
            "Carefully remove the cod to a plate and set aside, keeping it warm.",
            "Add sliced garlic and broken chili to the oil and cook until the garlic is just golden, then remove them.",
            "Off the heat, begin swirling the cazuela in a circular motion, tilting it to create the pil pil emulsion as the fish gelatin and oil combine into a creamy white sauce.",
            "Return the cod and garlic to the cazuela, spoon the pil pil sauce over the fish.",
            "Garnish with parsley and serve immediately in the cazuela."
        ]
    },
    {
        "name": "Merluza a la Vasca",
        "description": "Basque-style hake in a vibrant green sauce of garlic, parsley, white wine, and peas, a refined and elegant fish dish.",
        "origin": "Spanish",
        "dietary": ["pescatarian", "gluten-free", "dairy-free", "nut-free"],
        "prep_time_minutes": 15,
        "cook_time_minutes": 20,
        "servings": 4,
        "difficulty": "medium",
        "ingredients": [
            {"name": "hake fillets", "quantity": 600, "unit": "g", "category": "seafood"},
            {"name": "garlic cloves", "quantity": 4, "unit": "pcs", "category": "produce"},
            {"name": "flat-leaf parsley", "quantity": 30, "unit": "g", "category": "produce"},
            {"name": "dry white wine", "quantity": 150, "unit": "ml", "category": "beverages"},
            {"name": "fish stock", "quantity": 150, "unit": "ml", "category": "pantry"},
            {"name": "frozen peas", "quantity": 100, "unit": "g", "category": "frozen"},
            {"name": "clams", "quantity": 200, "unit": "g", "category": "seafood"},
            {"name": "extra virgin olive oil", "quantity": 80, "unit": "ml", "category": "condiments"},
            {"name": "plain flour", "quantity": 1, "unit": "tbsp", "category": "pantry"},
            {"name": "salt", "quantity": 0.5, "unit": "tsp", "category": "spices"}
        ],
        "instructions": [
            "Season the hake fillets with salt and lightly dust with flour.",
            "Heat olive oil in a wide cazuela over medium heat and cook the hake skin-side down for 3 minutes, then carefully remove.",
            "In the same oil, gently fry sliced garlic until golden, then add finely chopped parsley stems and cook for 1 minute.",
            "Pour in the white wine and fish stock, bring to a simmer, and shake the pan gently to begin emulsifying the sauce.",
            "Add the peas and clams, then nestle the hake fillets back in skin-side up.",
            "Cover and cook for 8-10 minutes, gently shaking the pan periodically to thicken the green sauce, until the clams open and fish is cooked.",
            "Scatter with chopped parsley leaves and serve immediately in the cazuela."
        ]
    },
    {
        "name": "Cocido Madrileno",
        "description": "Madrid's iconic chickpea stew served in three courses: first the broth with noodles, then the chickpeas and vegetables, and finally the meats.",
        "origin": "Spanish",
        "dietary": ["nut-free"],
        "prep_time_minutes": 30,
        "cook_time_minutes": 180,
        "servings": 8,
        "difficulty": "hard",
        "ingredients": [
            {"name": "dried chickpeas", "quantity": 500, "unit": "g", "category": "pantry"},
            {"name": "beef shank", "quantity": 500, "unit": "g", "category": "meat"},
            {"name": "chicken thighs", "quantity": 400, "unit": "g", "category": "meat"},
            {"name": "chorizo", "quantity": 200, "unit": "g", "category": "meat"},
            {"name": "morcilla", "quantity": 150, "unit": "g", "category": "meat"},
            {"name": "Serrano ham bone", "quantity": 1, "unit": "pcs", "category": "meat"},
            {"name": "cabbage", "quantity": 300, "unit": "g", "category": "produce"},
            {"name": "carrots", "quantity": 2, "unit": "pcs", "category": "produce"},
            {"name": "potatoes", "quantity": 400, "unit": "g", "category": "produce"},
            {"name": "leek", "quantity": 1, "unit": "pcs", "category": "produce"},
            {"name": "fideos noodles", "quantity": 100, "unit": "g", "category": "pantry"},
            {"name": "garlic cloves", "quantity": 3, "unit": "pcs", "category": "produce"},
            {"name": "salt", "quantity": 1, "unit": "tsp", "category": "spices"},
            {"name": "black peppercorns", "quantity": 6, "unit": "pcs", "category": "spices"}
        ],
        "instructions": [
            "Soak the chickpeas overnight in cold water with a pinch of salt, then drain.",
            "Place the beef shank, chicken, ham bone, chickpeas, peppercorns, and whole garlic in a very large pot and cover with cold water.",
            "Bring slowly to a boil, skimming the foam constantly, then reduce to a gentle simmer.",
            "After 1 hour, add the carrots, leek, and potatoes, and continue simmering.",
            "After another 30 minutes, add the chorizo and morcilla, cooking for 30 minutes more.",
            "Add the quartered cabbage and cook for a final 30 minutes until everything is tender.",
            "Strain the broth into a separate pot, cook the fideos noodles in it, and serve as the first course.",
            "Arrange the chickpeas and vegetables on one platter and the sliced meats on another, serving as the second and third courses."
        ]
    },
    {
        "name": "Migas",
        "description": "Rustic fried breadcrumbs from shepherds' cuisine, crisped with olive oil, garlic, chorizo, and smoked paprika, topped with grapes and fried eggs.",
        "origin": "Spanish",
        "dietary": ["nut-free"],
        "prep_time_minutes": 20,
        "cook_time_minutes": 25,
        "servings": 4,
        "difficulty": "easy",
        "ingredients": [
            {"name": "stale bread", "quantity": 400, "unit": "g", "category": "bakery"},
            {"name": "chorizo", "quantity": 150, "unit": "g", "category": "meat"},
            {"name": "garlic cloves", "quantity": 4, "unit": "pcs", "category": "produce"},
            {"name": "smoked paprika", "quantity": 1, "unit": "tsp", "category": "spices"},
            {"name": "extra virgin olive oil", "quantity": 100, "unit": "ml", "category": "condiments"},
            {"name": "water", "quantity": 100, "unit": "ml", "category": "beverages"},
            {"name": "eggs", "quantity": 4, "unit": "pcs", "category": "dairy"},
            {"name": "grapes", "quantity": 150, "unit": "g", "category": "produce"},
            {"name": "salt", "quantity": 0.5, "unit": "tsp", "category": "spices"}
        ],
        "instructions": [
            "Tear the stale bread into small rough crumbs, sprinkle with salted water, and let it sit for 30 minutes to soften slightly.",
            "Heat half the olive oil in a large skillet and fry sliced chorizo until crispy, then remove and set aside.",
            "In the same oil, fry whole peeled garlic cloves until golden, then remove.",
            "Add the remaining olive oil, sprinkle in the smoked paprika, and add the moistened breadcrumbs.",
            "Fry the breadcrumbs over medium heat, stirring and turning constantly for 15-20 minutes until golden and crispy throughout.",
            "In a separate pan, fry the eggs in olive oil until the edges are crispy.",
            "Serve the migas on a plate topped with the crispy chorizo, fried garlic, fried egg, and fresh grapes."
        ]
    },
    {
        "name": "Callos a la Madrilena",
        "description": "Madrid-style slow-cooked tripe stew with chorizo, morcilla, and chickpeas in a spicy smoky paprika sauce.",
        "origin": "Spanish",
        "dietary": ["gluten-free", "dairy-free", "nut-free"],
        "prep_time_minutes": 30,
        "cook_time_minutes": 180,
        "servings": 6,
        "difficulty": "hard",
        "ingredients": [
            {"name": "beef tripe", "quantity": 800, "unit": "g", "category": "meat"},
            {"name": "chorizo", "quantity": 150, "unit": "g", "category": "meat"},
            {"name": "morcilla", "quantity": 150, "unit": "g", "category": "meat"},
            {"name": "cooked chickpeas", "quantity": 200, "unit": "g", "category": "pantry"},
            {"name": "onion", "quantity": 1, "unit": "pcs", "category": "produce"},
            {"name": "garlic cloves", "quantity": 4, "unit": "pcs", "category": "produce"},
            {"name": "smoked paprika", "quantity": 2, "unit": "tsp", "category": "spices"},
            {"name": "hot paprika", "quantity": 1, "unit": "tsp", "category": "spices"},
            {"name": "bay leaves", "quantity": 2, "unit": "pcs", "category": "spices"},
            {"name": "tomato paste", "quantity": 2, "unit": "tbsp", "category": "pantry"},
            {"name": "extra virgin olive oil", "quantity": 60, "unit": "ml", "category": "condiments"},
            {"name": "salt", "quantity": 1, "unit": "tsp", "category": "spices"},
            {"name": "black pepper", "quantity": 0.5, "unit": "tsp", "category": "spices"}
        ],
        "instructions": [
            "Clean the tripe thoroughly, cut into 3cm pieces, and boil in salted water for 10 minutes, then drain and rinse.",
            "In a large pot, cover the tripe with fresh water, add bay leaves, and simmer for 2 hours until tender.",
            "In a separate pan, heat olive oil and saute the diced onion and garlic until soft.",
            "Add smoked paprika, hot paprika, and tomato paste, stirring for 1 minute.",
            "Add this sofrito to the tripe pot along with sliced chorizo, morcilla, and chickpeas.",
            "Simmer everything together for another 45 minutes until the sauce is thick and the flavors have melded.",
            "Season with salt and pepper.",
            "Serve very hot in deep bowls, ideally the next day when the flavors are even better."
        ]
    },
    # =========================================================================
    # SOUPS
    # =========================================================================
    {
        "name": "Gazpacho",
        "description": "Chilled Andalusian tomato soup blended with peppers, cucumber, garlic, bread, and sherry vinegar, the quintessential summer refreshment.",
        "origin": "Spanish",
        "dietary": ["vegan", "dairy-free", "nut-free", "halal"],
        "prep_time_minutes": 20,
        "cook_time_minutes": 0,
        "servings": 6,
        "difficulty": "easy",
        "ingredients": [
            {"name": "ripe tomatoes", "quantity": 1000, "unit": "g", "category": "produce"},
            {"name": "cucumber", "quantity": 1, "unit": "pcs", "category": "produce"},
            {"name": "green bell pepper", "quantity": 1, "unit": "pcs", "category": "produce"},
            {"name": "garlic cloves", "quantity": 2, "unit": "pcs", "category": "produce"},
            {"name": "stale bread", "quantity": 100, "unit": "g", "category": "bakery"},
            {"name": "extra virgin olive oil", "quantity": 80, "unit": "ml", "category": "condiments"},
            {"name": "sherry vinegar", "quantity": 2, "unit": "tbsp", "category": "condiments"},
            {"name": "salt", "quantity": 1, "unit": "tsp", "category": "spices"},
            {"name": "water", "quantity": 100, "unit": "ml", "category": "beverages"}
        ],
        "instructions": [
            "Roughly chop the tomatoes, cucumber, green pepper, and garlic.",
            "Soak the stale bread in water for a few minutes until softened.",
            "Place all the vegetables and soaked bread in a blender with the olive oil, sherry vinegar, salt, and water.",
            "Blend on high until very smooth and creamy.",
            "Pass through a fine sieve for an extra smooth texture if desired.",
            "Chill in the refrigerator for at least 2 hours.",
            "Serve ice-cold in bowls, drizzled with olive oil and garnished with finely diced cucumber, pepper, and croutons."
        ]
    },
    {
        "name": "Salmorejo",
        "description": "A thick creamy cold tomato soup from Cordoba, richer than gazpacho, traditionally topped with diced Serrano ham and hard-boiled egg.",
        "origin": "Spanish",
        "dietary": ["nut-free"],
        "prep_time_minutes": 15,
        "cook_time_minutes": 0,
        "servings": 4,
        "difficulty": "easy",
        "ingredients": [
            {"name": "ripe tomatoes", "quantity": 1000, "unit": "g", "category": "produce"},
            {"name": "stale bread", "quantity": 200, "unit": "g", "category": "bakery"},
            {"name": "extra virgin olive oil", "quantity": 100, "unit": "ml", "category": "condiments"},
            {"name": "garlic clove", "quantity": 1, "unit": "pcs", "category": "produce"},
            {"name": "sherry vinegar", "quantity": 1, "unit": "tbsp", "category": "condiments"},
            {"name": "salt", "quantity": 1, "unit": "tsp", "category": "spices"},
            {"name": "Serrano ham", "quantity": 80, "unit": "g", "category": "meat"},
            {"name": "eggs", "quantity": 2, "unit": "pcs", "category": "dairy"}
        ],
        "instructions": [
            "Score the tomatoes, blanch briefly in boiling water, peel, and roughly chop.",
            "Remove the crusts from the bread and soak in water until softened.",
            "Blend the tomatoes, squeezed bread, garlic, salt, and sherry vinegar until very smooth.",
            "With the blender running, slowly drizzle in the olive oil to create a thick, creamy emulsion.",
            "Chill thoroughly in the refrigerator for at least 2 hours.",
            "Hard-boil the eggs, peel, and finely dice them.",
            "Serve the salmorejo in bowls topped with diced Serrano ham, chopped hard-boiled egg, and a drizzle of olive oil."
        ]
    },
    {
        "name": "Caldo Gallego",
        "description": "A warming Galician broth with white beans, turnip greens, potatoes, and pork, the ultimate comfort food from rainy northwest Spain.",
        "origin": "Spanish",
        "dietary": ["gluten-free", "dairy-free", "nut-free"],
        "prep_time_minutes": 20,
        "cook_time_minutes": 120,
        "servings": 6,
        "difficulty": "medium",
        "ingredients": [
            {"name": "dried white beans", "quantity": 300, "unit": "g", "category": "pantry"},
            {"name": "turnip greens", "quantity": 300, "unit": "g", "category": "produce"},
            {"name": "potatoes", "quantity": 400, "unit": "g", "category": "produce"},
            {"name": "smoked pork ribs", "quantity": 300, "unit": "g", "category": "meat"},
            {"name": "chorizo", "quantity": 150, "unit": "g", "category": "meat"},
            {"name": "Serrano ham bone", "quantity": 1, "unit": "pcs", "category": "meat"},
            {"name": "onion", "quantity": 1, "unit": "pcs", "category": "produce"},
            {"name": "garlic cloves", "quantity": 2, "unit": "pcs", "category": "produce"},
            {"name": "salt", "quantity": 1, "unit": "tsp", "category": "spices"},
            {"name": "extra virgin olive oil", "quantity": 30, "unit": "ml", "category": "condiments"}
        ],
        "instructions": [
            "Soak the white beans overnight in cold water, then drain.",
            "Place the beans, ham bone, smoked pork ribs, halved onion, and garlic in a large pot, cover with cold water, and bring to a boil.",
            "Reduce heat and simmer gently for 1 hour, skimming any foam from the surface.",
            "Add the peeled and cubed potatoes and whole chorizo, continuing to simmer for 30 minutes.",
            "Wash the turnip greens, remove tough stems, roughly chop, and add to the pot.",
            "Cook for a final 20-30 minutes until the greens are tender and the beans are creamy.",
            "Remove the meats, slice the chorizo and shred the pork from the ribs, and return to the pot.",
            "Season with salt, drizzle with olive oil, and serve steaming hot in deep bowls."
        ]
    },
    {
        "name": "Sopa de Ajo",
        "description": "Castilian garlic soup made with stale bread, plenty of garlic, smoked paprika, and topped with a poached egg, a humble but deeply satisfying dish.",
        "origin": "Spanish",
        "dietary": ["vegetarian", "nut-free", "halal"],
        "prep_time_minutes": 10,
        "cook_time_minutes": 25,
        "servings": 4,
        "difficulty": "easy",
        "ingredients": [
            {"name": "garlic cloves", "quantity": 8, "unit": "pcs", "category": "produce"},
            {"name": "stale bread", "quantity": 200, "unit": "g", "category": "bakery"},
            {"name": "smoked paprika", "quantity": 1.5, "unit": "tsp", "category": "spices"},
            {"name": "extra virgin olive oil", "quantity": 80, "unit": "ml", "category": "condiments"},
            {"name": "chicken or vegetable stock", "quantity": 1000, "unit": "ml", "category": "pantry"},
            {"name": "eggs", "quantity": 4, "unit": "pcs", "category": "dairy"},
            {"name": "salt", "quantity": 0.5, "unit": "tsp", "category": "spices"},
            {"name": "flat-leaf parsley", "quantity": 10, "unit": "g", "category": "produce"}
        ],
        "instructions": [
            "Slice the bread into thin rounds or tear into rough pieces.",
            "Heat olive oil in a cazuela over medium heat and fry the thinly sliced garlic until pale golden.",
            "Add the smoked paprika and stir for 10 seconds, being careful not to burn it.",
            "Immediately add the bread pieces and toss to coat in the garlicky paprika oil.",
            "Pour in the stock, bring to a simmer, and cook for 15 minutes until the bread has softened and the soup has thickened.",
            "Season with salt, then crack the eggs directly into the simmering soup.",
            "Cover and cook gently for 4-5 minutes until the eggs are poached but still runny.",
            "Sprinkle with chopped parsley and serve immediately in the cazuela."
        ]
    },
    # =========================================================================
    # SEAFOOD
    # =========================================================================
    {
        "name": "Gambas a la Plancha",
        "description": "Whole prawns simply grilled on a flat griddle with just sea salt and olive oil, showcasing the pure flavor of the seafood.",
        "origin": "Spanish",
        "dietary": ["pescatarian", "gluten-free", "dairy-free", "nut-free", "low-carb", "keto"],
        "prep_time_minutes": 5,
        "cook_time_minutes": 5,
        "servings": 4,
        "difficulty": "easy",
        "ingredients": [
            {"name": "large shell-on prawns", "quantity": 500, "unit": "g", "category": "seafood"},
            {"name": "extra virgin olive oil", "quantity": 30, "unit": "ml", "category": "condiments"},
            {"name": "coarse sea salt", "quantity": 1, "unit": "tsp", "category": "spices"},
            {"name": "lemon", "quantity": 1, "unit": "pcs", "category": "produce"},
            {"name": "flat-leaf parsley", "quantity": 10, "unit": "g", "category": "produce"}
        ],
        "instructions": [
            "Pat the prawns dry and toss lightly with olive oil and coarse sea salt.",
            "Heat a plancha or large flat griddle to very high heat until smoking.",
            "Place the prawns in a single layer and cook for 2 minutes without moving until the shells are charred and pink.",
            "Flip and cook for another 1-2 minutes until just cooked through.",
            "Transfer to a plate, drizzle with more olive oil, and sprinkle with chopped parsley.",
            "Serve immediately with lemon wedges for squeezing."
        ]
    },
    {
        "name": "Calamares a la Romana",
        "description": "Classic fried squid rings in a light crispy batter, served with lemon wedges, found in tapas bars and bocadillo shops across Spain.",
        "origin": "Spanish",
        "dietary": ["pescatarian", "dairy-free", "nut-free"],
        "prep_time_minutes": 15,
        "cook_time_minutes": 15,
        "servings": 4,
        "difficulty": "easy",
        "ingredients": [
            {"name": "squid tubes", "quantity": 500, "unit": "g", "category": "seafood"},
            {"name": "plain flour", "quantity": 150, "unit": "g", "category": "pantry"},
            {"name": "sparkling water", "quantity": 150, "unit": "ml", "category": "beverages"},
            {"name": "egg", "quantity": 1, "unit": "pcs", "category": "dairy"},
            {"name": "olive oil for frying", "quantity": 500, "unit": "ml", "category": "condiments"},
            {"name": "lemon", "quantity": 1, "unit": "pcs", "category": "produce"},
            {"name": "salt", "quantity": 1, "unit": "tsp", "category": "spices"}
        ],
        "instructions": [
            "Clean the squid tubes and cut into 1cm thick rings, then pat very dry.",
            "Make the batter by whisking the flour, egg, sparkling water, and a pinch of salt until smooth but still slightly lumpy.",
            "Heat the olive oil in a deep pan to 180C.",
            "Dip the squid rings into the batter, letting excess drip off.",
            "Fry in batches for 2-3 minutes until golden and crispy, turning once.",
            "Drain on paper towels and season with salt immediately.",
            "Serve hot with lemon wedges, either as a tapa or stuffed into a crusty roll for a bocadillo de calamares."
        ]
    },
    {
        "name": "Zarzuela de Mariscos",
        "description": "A spectacular Catalan seafood stew of mixed fish and shellfish in a rich tomato, saffron, and brandy sauce.",
        "origin": "Spanish",
        "dietary": ["pescatarian", "dairy-free", "nut-free"],
        "prep_time_minutes": 30,
        "cook_time_minutes": 35,
        "servings": 6,
        "difficulty": "hard",
        "ingredients": [
            {"name": "monkfish fillets", "quantity": 300, "unit": "g", "category": "seafood"},
            {"name": "large prawns", "quantity": 250, "unit": "g", "category": "seafood"},
            {"name": "mussels", "quantity": 300, "unit": "g", "category": "seafood"},
            {"name": "clams", "quantity": 250, "unit": "g", "category": "seafood"},
            {"name": "squid", "quantity": 200, "unit": "g", "category": "seafood"},
            {"name": "onion", "quantity": 1, "unit": "pcs", "category": "produce"},
            {"name": "garlic cloves", "quantity": 4, "unit": "pcs", "category": "produce"},
            {"name": "crushed tomatoes", "quantity": 400, "unit": "g", "category": "pantry"},
            {"name": "brandy", "quantity": 60, "unit": "ml", "category": "beverages"},
            {"name": "fish stock", "quantity": 300, "unit": "ml", "category": "pantry"},
            {"name": "saffron threads", "quantity": 0.5, "unit": "g", "category": "spices"},
            {"name": "extra virgin olive oil", "quantity": 60, "unit": "ml", "category": "condiments"},
            {"name": "plain flour", "quantity": 2, "unit": "tbsp", "category": "pantry"},
            {"name": "flat-leaf parsley", "quantity": 15, "unit": "g", "category": "produce"},
            {"name": "salt", "quantity": 1, "unit": "tsp", "category": "spices"}
        ],
        "instructions": [
            "Cut the monkfish into large chunks and the squid into rings, season with salt, and dust lightly with flour.",
            "Heat olive oil in a large wide cazuela and briefly sear the monkfish and squid, then set aside.",
            "In the same pan, saute the finely diced onion and garlic until soft.",
            "Pour in the brandy and carefully flambe, then add the crushed tomatoes, fish stock, and saffron.",
            "Simmer the sauce for 15 minutes until reduced and flavorful.",
            "Return the monkfish and squid to the pan, add the prawns, mussels, and clams.",
            "Cover and cook for 8-10 minutes until all the shellfish have opened and the fish is cooked through.",
            "Discard any unopened shellfish, scatter with chopped parsley, and serve the zarzuela directly from the cazuela with crusty bread."
        ]
    },
    # =========================================================================
    # DESSERTS
    # =========================================================================
    {
        "name": "Churros con Chocolate",
        "description": "Golden fried dough sticks with a crispy exterior and soft interior, served with thick Spanish hot chocolate for dipping.",
        "origin": "Spanish",
        "dietary": ["vegetarian", "nut-free", "halal"],
        "prep_time_minutes": 15,
        "cook_time_minutes": 20,
        "servings": 4,
        "difficulty": "medium",
        "ingredients": [
            {"name": "plain flour", "quantity": 250, "unit": "g", "category": "pantry"},
            {"name": "water", "quantity": 250, "unit": "ml", "category": "beverages"},
            {"name": "olive oil", "quantity": 2, "unit": "tbsp", "category": "condiments"},
            {"name": "salt", "quantity": 0.5, "unit": "tsp", "category": "spices"},
            {"name": "sugar", "quantity": 50, "unit": "g", "category": "pantry"},
            {"name": "cinnamon", "quantity": 1, "unit": "tsp", "category": "spices"},
            {"name": "olive oil for frying", "quantity": 500, "unit": "ml", "category": "condiments"},
            {"name": "dark chocolate", "quantity": 200, "unit": "g", "category": "pantry"},
            {"name": "whole milk", "quantity": 300, "unit": "ml", "category": "dairy"},
            {"name": "cornstarch", "quantity": 1, "unit": "tbsp", "category": "pantry"}
        ],
        "instructions": [
            "Bring the water, 2 tablespoons olive oil, and salt to a boil in a saucepan.",
            "Remove from heat and add the flour all at once, stirring vigorously with a wooden spoon until a smooth dough forms and pulls away from the sides.",
            "Transfer the dough to a churrera or piping bag fitted with a large star nozzle.",
            "Heat the frying oil to 190C and pipe 15cm lengths of dough directly into the hot oil, cutting with scissors.",
            "Fry in batches for 3-4 minutes, turning once, until deep golden and crispy.",
            "Drain on paper towels and roll in the sugar and cinnamon mixture while still hot.",
            "For the chocolate, heat the milk, whisk in chopped chocolate and cornstarch, and stir over low heat until thick and glossy.",
            "Serve the warm churros immediately with the thick hot chocolate for dunking."
        ]
    },
    {
        "name": "Crema Catalana",
        "description": "Catalonia's answer to creme brulee, a silky custard infused with lemon zest and cinnamon, topped with a crackly caramelized sugar crust.",
        "origin": "Spanish",
        "dietary": ["vegetarian", "gluten-free", "nut-free", "halal"],
        "prep_time_minutes": 15,
        "cook_time_minutes": 15,
        "servings": 6,
        "difficulty": "medium",
        "ingredients": [
            {"name": "whole milk", "quantity": 750, "unit": "ml", "category": "dairy"},
            {"name": "egg yolks", "quantity": 6, "unit": "pcs", "category": "dairy"},
            {"name": "sugar", "quantity": 150, "unit": "g", "category": "pantry"},
            {"name": "cornstarch", "quantity": 30, "unit": "g", "category": "pantry"},
            {"name": "lemon zest", "quantity": 2, "unit": "strips", "category": "produce"},
            {"name": "cinnamon stick", "quantity": 1, "unit": "pcs", "category": "spices"},
            {"name": "vanilla extract", "quantity": 1, "unit": "tsp", "category": "pantry"}
        ],
        "instructions": [
            "Heat the milk with the lemon zest strips and cinnamon stick until just simmering, then remove from heat and steep for 15 minutes.",
            "Whisk the egg yolks with 100g of sugar and the cornstarch until pale and thick.",
            "Strain the infused milk and gradually whisk it into the egg mixture.",
            "Return to the saucepan and cook over medium-low heat, stirring constantly, until the custard thickens enough to coat the back of a spoon.",
            "Add vanilla extract, then pour into individual shallow clay dishes.",
            "Refrigerate for at least 4 hours until completely set.",
            "Just before serving, sprinkle the remaining sugar evenly over each custard and caramelize with a kitchen torch or under a very hot grill until golden and crackly."
        ]
    },
    {
        "name": "Tarta de Santiago",
        "description": "A moist almond cake from Galicia marked with the Cross of Saint James, made without flour and with a wonderful dense texture.",
        "origin": "Spanish",
        "dietary": ["vegetarian", "gluten-free"],
        "prep_time_minutes": 15,
        "cook_time_minutes": 40,
        "servings": 8,
        "difficulty": "easy",
        "ingredients": [
            {"name": "ground almonds", "quantity": 250, "unit": "g", "category": "pantry"},
            {"name": "sugar", "quantity": 200, "unit": "g", "category": "pantry"},
            {"name": "eggs", "quantity": 4, "unit": "pcs", "category": "dairy"},
            {"name": "lemon zest", "quantity": 1, "unit": "tsp", "category": "produce"},
            {"name": "cinnamon", "quantity": 0.5, "unit": "tsp", "category": "spices"},
            {"name": "butter for greasing", "quantity": 10, "unit": "g", "category": "dairy"},
            {"name": "powdered sugar", "quantity": 30, "unit": "g", "category": "pantry"}
        ],
        "instructions": [
            "Preheat the oven to 180C and grease a 24cm round cake tin with butter.",
            "Beat the eggs and sugar together until very light, pale, and fluffy, about 5 minutes.",
            "Gently fold in the ground almonds, lemon zest, and cinnamon until just combined.",
            "Pour the batter into the prepared tin and smooth the top.",
            "Bake for 35-40 minutes until golden and a skewer comes out clean.",
            "Let the cake cool completely in the tin.",
            "Place a cross of Saint James stencil on top and dust generously with powdered sugar, then carefully remove the stencil to reveal the pattern."
        ]
    },
    {
        "name": "Flan",
        "description": "Classic Spanish caramel custard with a golden caramel base, silky smooth egg custard, and a rich vanilla flavor.",
        "origin": "Spanish",
        "dietary": ["vegetarian", "gluten-free", "nut-free", "halal"],
        "prep_time_minutes": 15,
        "cook_time_minutes": 50,
        "servings": 6,
        "difficulty": "medium",
        "ingredients": [
            {"name": "whole milk", "quantity": 500, "unit": "ml", "category": "dairy"},
            {"name": "eggs", "quantity": 4, "unit": "pcs", "category": "dairy"},
            {"name": "egg yolks", "quantity": 2, "unit": "pcs", "category": "dairy"},
            {"name": "sugar", "quantity": 200, "unit": "g", "category": "pantry"},
            {"name": "vanilla extract", "quantity": 1, "unit": "tsp", "category": "pantry"},
            {"name": "lemon zest", "quantity": 1, "unit": "strip", "category": "produce"},
            {"name": "water", "quantity": 60, "unit": "ml", "category": "beverages"}
        ],
        "instructions": [
            "Make the caramel by heating 100g sugar with the water in a saucepan over medium heat without stirring until deep amber, then pour into a 1-liter mold, swirling to coat the bottom.",
            "Heat the milk with the lemon zest until just simmering, then let it cool slightly and remove the zest.",
            "Whisk the whole eggs, egg yolks, remaining 100g sugar, and vanilla until combined but not frothy.",
            "Gradually pour the warm milk into the egg mixture, whisking gently, then strain through a fine sieve.",
            "Pour the custard over the caramel in the mold and place in a bain-marie with hot water reaching halfway up the sides.",
            "Bake at 160C for 45-50 minutes until the custard is just set with a slight wobble in the center.",
            "Cool completely, then refrigerate for at least 6 hours or overnight.",
            "To unmold, run a knife around the edge and invert onto a plate, letting the caramel sauce flow over the flan."
        ]
    },
    {
        "name": "Arroz con Leche",
        "description": "Spanish rice pudding slowly cooked with milk, sugar, lemon zest, and cinnamon, served with a caramelized sugar top.",
        "origin": "Spanish",
        "dietary": ["vegetarian", "gluten-free", "nut-free", "halal"],
        "prep_time_minutes": 5,
        "cook_time_minutes": 50,
        "servings": 6,
        "difficulty": "easy",
        "ingredients": [
            {"name": "short-grain rice", "quantity": 200, "unit": "g", "category": "pantry"},
            {"name": "whole milk", "quantity": 1000, "unit": "ml", "category": "dairy"},
            {"name": "sugar", "quantity": 150, "unit": "g", "category": "pantry"},
            {"name": "lemon zest", "quantity": 2, "unit": "strips", "category": "produce"},
            {"name": "cinnamon stick", "quantity": 1, "unit": "pcs", "category": "spices"},
            {"name": "butter", "quantity": 20, "unit": "g", "category": "dairy"},
            {"name": "ground cinnamon", "quantity": 1, "unit": "tsp", "category": "spices"},
            {"name": "water", "quantity": 300, "unit": "ml", "category": "beverages"}
        ],
        "instructions": [
            "Bring the water to a boil, add the rice, and cook for 5 minutes, then drain.",
            "In a large saucepan, heat the milk with the lemon zest and cinnamon stick until simmering.",
            "Add the par-cooked rice and stir well.",
            "Cook over low heat for 40-45 minutes, stirring frequently to prevent sticking, until the rice is very tender and the mixture is creamy.",
            "Remove the lemon zest and cinnamon stick, stir in the sugar and butter until dissolved.",
            "Pour into individual dishes and let cool to room temperature.",
            "Dust the top with ground cinnamon and optionally caramelize a sprinkle of sugar on top with a torch.",
            "Serve at room temperature or chilled."
        ]
    },
    {
        "name": "Torrijas",
        "description": "Spanish-style French toast soaked in sweet milk and wine, fried until golden, and dusted with cinnamon sugar, a traditional Easter treat.",
        "origin": "Spanish",
        "dietary": ["vegetarian", "nut-free", "halal"],
        "prep_time_minutes": 20,
        "cook_time_minutes": 15,
        "servings": 6,
        "difficulty": "easy",
        "ingredients": [
            {"name": "stale bread loaf", "quantity": 1, "unit": "pcs", "category": "bakery"},
            {"name": "whole milk", "quantity": 500, "unit": "ml", "category": "dairy"},
            {"name": "sugar", "quantity": 100, "unit": "g", "category": "pantry"},
            {"name": "cinnamon stick", "quantity": 1, "unit": "pcs", "category": "spices"},
            {"name": "lemon zest", "quantity": 2, "unit": "strips", "category": "produce"},
            {"name": "eggs", "quantity": 3, "unit": "pcs", "category": "dairy"},
            {"name": "olive oil for frying", "quantity": 300, "unit": "ml", "category": "condiments"},
            {"name": "ground cinnamon", "quantity": 1, "unit": "tsp", "category": "spices"},
            {"name": "honey", "quantity": 60, "unit": "ml", "category": "condiments"}
        ],
        "instructions": [
            "Slice the stale bread into 2cm thick slices.",
            "Heat the milk with 50g sugar, cinnamon stick, and lemon zest until simmering, then let it cool slightly.",
            "Soak the bread slices in the warm sweetened milk until saturated but not falling apart, about 2 minutes per side.",
            "Beat the eggs in a shallow dish.",
            "Dip each soaked bread slice in beaten egg to coat completely.",
            "Fry in olive oil over medium heat until golden brown on both sides, about 2 minutes per side.",
            "Mix the remaining sugar with ground cinnamon and roll the hot torrijas in the mixture.",
            "Drizzle with honey and serve warm or at room temperature."
        ]
    },
    {
        "name": "Leche Frita",
        "description": "Fried milk squares, a custard set firm, cut into pieces, breaded and fried until crispy outside and creamy inside, dusted with cinnamon sugar.",
        "origin": "Spanish",
        "dietary": ["vegetarian", "nut-free", "halal"],
        "prep_time_minutes": 20,
        "cook_time_minutes": 30,
        "servings": 6,
        "difficulty": "medium",
        "ingredients": [
            {"name": "whole milk", "quantity": 500, "unit": "ml", "category": "dairy"},
            {"name": "sugar", "quantity": 120, "unit": "g", "category": "pantry"},
            {"name": "cornstarch", "quantity": 80, "unit": "g", "category": "pantry"},
            {"name": "egg yolks", "quantity": 3, "unit": "pcs", "category": "dairy"},
            {"name": "lemon zest", "quantity": 2, "unit": "strips", "category": "produce"},
            {"name": "cinnamon stick", "quantity": 1, "unit": "pcs", "category": "spices"},
            {"name": "eggs", "quantity": 2, "unit": "pcs", "category": "dairy"},
            {"name": "plain flour", "quantity": 60, "unit": "g", "category": "pantry"},
            {"name": "olive oil for frying", "quantity": 300, "unit": "ml", "category": "condiments"},
            {"name": "ground cinnamon", "quantity": 1, "unit": "tsp", "category": "spices"}
        ],
        "instructions": [
            "Heat the milk with lemon zest and cinnamon stick until simmering, then strain and discard the aromatics.",
            "Whisk the egg yolks with 80g sugar and cornstarch until smooth.",
            "Gradually whisk the hot milk into the egg yolk mixture, then return to the saucepan.",
            "Cook over medium heat, stirring constantly, until the custard is very thick and pulls away from the sides of the pan.",
            "Pour into a lined tray about 2cm deep, smooth the surface, and refrigerate for at least 4 hours until completely firm.",
            "Cut the set custard into rectangles, dust with flour, then dip in beaten egg.",
            "Fry in olive oil at 180C until golden on all sides, about 2 minutes.",
            "Drain on paper towels and roll in the remaining sugar mixed with ground cinnamon while still warm."
        ]
    },
    {
        "name": "Natillas",
        "description": "A velvety smooth Spanish vanilla custard flavored with lemon and cinnamon, served chilled in individual cups with a cookie on top.",
        "origin": "Spanish",
        "dietary": ["vegetarian", "gluten-free", "nut-free", "halal"],
        "prep_time_minutes": 10,
        "cook_time_minutes": 15,
        "servings": 4,
        "difficulty": "easy",
        "ingredients": [
            {"name": "whole milk", "quantity": 500, "unit": "ml", "category": "dairy"},
            {"name": "egg yolks", "quantity": 4, "unit": "pcs", "category": "dairy"},
            {"name": "sugar", "quantity": 80, "unit": "g", "category": "pantry"},
            {"name": "cornstarch", "quantity": 15, "unit": "g", "category": "pantry"},
            {"name": "lemon zest", "quantity": 2, "unit": "strips", "category": "produce"},
            {"name": "cinnamon stick", "quantity": 1, "unit": "pcs", "category": "spices"},
            {"name": "vanilla extract", "quantity": 1, "unit": "tsp", "category": "pantry"},
            {"name": "Maria cookies", "quantity": 4, "unit": "pcs", "category": "bakery"},
            {"name": "ground cinnamon", "quantity": 0.5, "unit": "tsp", "category": "spices"}
        ],
        "instructions": [
            "Heat the milk with the lemon zest and cinnamon stick until it just begins to simmer, then remove from heat and steep for 10 minutes.",
            "Whisk the egg yolks with sugar and cornstarch until pale and smooth.",
            "Strain the infused milk and gradually whisk it into the egg mixture.",
            "Return to the saucepan and cook over low heat, stirring constantly with a wooden spoon, until the custard thickens and coats the back of the spoon.",
            "Stir in the vanilla extract and immediately pour into individual cups or glasses.",
            "Press a sheet of cling film onto the surface of each custard to prevent a skin from forming.",
            "Refrigerate for at least 4 hours until well chilled.",
            "Serve each cup topped with a Maria cookie and a light dusting of ground cinnamon."
        ]
    },
    # =========================================================================
    # SALADS & SIDES
    # =========================================================================
    {
        "name": "Ensalada Mixta",
        "description": "A classic Spanish mixed salad of lettuce, tomato, onion, tuna, olives, and hard-boiled egg dressed simply with olive oil and vinegar.",
        "origin": "Spanish",
        "dietary": ["pescatarian", "gluten-free", "dairy-free", "nut-free"],
        "prep_time_minutes": 15,
        "cook_time_minutes": 10,
        "servings": 4,
        "difficulty": "easy",
        "ingredients": [
            {"name": "iceberg lettuce", "quantity": 1, "unit": "pcs", "category": "produce"},
            {"name": "ripe tomatoes", "quantity": 3, "unit": "pcs", "category": "produce"},
            {"name": "white onion", "quantity": 1, "unit": "pcs", "category": "produce"},
            {"name": "canned tuna in olive oil", "quantity": 200, "unit": "g", "category": "pantry"},
            {"name": "green olives", "quantity": 80, "unit": "g", "category": "pantry"},
            {"name": "eggs", "quantity": 2, "unit": "pcs", "category": "dairy"},
            {"name": "extra virgin olive oil", "quantity": 60, "unit": "ml", "category": "condiments"},
            {"name": "red wine vinegar", "quantity": 2, "unit": "tbsp", "category": "condiments"},
            {"name": "salt", "quantity": 0.5, "unit": "tsp", "category": "spices"}
        ],
        "instructions": [
            "Hard-boil the eggs, cool, peel, and cut into quarters.",
            "Tear the lettuce into bite-sized pieces and arrange on a large plate.",
            "Cut the tomatoes into wedges and the onion into thin rings.",
            "Arrange the tomato wedges, onion rings, drained tuna chunks, olives, and egg quarters over the lettuce.",
            "Whisk together the olive oil, red wine vinegar, and salt.",
            "Drizzle the dressing over the salad just before serving."
        ]
    },
    {
        "name": "Piquillos Rellenos",
        "description": "Sweet roasted piquillo peppers stuffed with a creamy salt cod and potato filling, baked in a light tomato sauce.",
        "origin": "Spanish",
        "dietary": ["pescatarian", "nut-free"],
        "prep_time_minutes": 30,
        "cook_time_minutes": 25,
        "servings": 4,
        "difficulty": "medium",
        "ingredients": [
            {"name": "piquillo peppers", "quantity": 12, "unit": "pcs", "category": "pantry"},
            {"name": "salt cod", "quantity": 200, "unit": "g", "category": "seafood"},
            {"name": "potatoes", "quantity": 200, "unit": "g", "category": "produce"},
            {"name": "whole milk", "quantity": 100, "unit": "ml", "category": "dairy"},
            {"name": "garlic cloves", "quantity": 2, "unit": "pcs", "category": "produce"},
            {"name": "extra virgin olive oil", "quantity": 60, "unit": "ml", "category": "condiments"},
            {"name": "onion", "quantity": 0.5, "unit": "pcs", "category": "produce"},
            {"name": "crushed tomatoes", "quantity": 200, "unit": "g", "category": "pantry"},
            {"name": "plain flour", "quantity": 1, "unit": "tbsp", "category": "pantry"},
            {"name": "flat-leaf parsley", "quantity": 10, "unit": "g", "category": "produce"},
            {"name": "salt", "quantity": 0.5, "unit": "tsp", "category": "spices"}
        ],
        "instructions": [
            "Desalt the cod by soaking for 24-36 hours, changing the water several times, then poach in milk until it flakes easily.",
            "Boil the potatoes until tender, drain, and mash smoothly.",
            "Flake the cod and mix with the mashed potato, a drizzle of olive oil, and minced garlic to make a creamy filling.",
            "Carefully stuff each piquillo pepper with the cod mixture, being gentle not to tear them.",
            "For the sauce, saute diced onion in olive oil until soft, add flour, stir, then add crushed tomatoes and simmer for 10 minutes.",
            "Place the stuffed peppers in an ovenproof dish and pour the tomato sauce around them.",
            "Bake at 180C for 15 minutes until heated through and bubbling.",
            "Garnish with chopped parsley and serve warm."
        ]
    },
]
