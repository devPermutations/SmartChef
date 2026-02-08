"""
Recipe JSON Generator
Merges all cuisine recipe files into a single recipes.json
"""
import json
import os
import importlib.util
import sys

def load_cuisine_module(filepath):
    spec = importlib.util.spec_from_file_location("cuisine", filepath)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.recipes

def main():
    recipes_dir = os.path.join(os.path.dirname(__file__), "recipes")
    all_recipes = []
    recipe_id = 1

    cuisine_files = sorted(f for f in os.listdir(recipes_dir) if f.endswith(".py") and f != "__init__.py")

    for cf in cuisine_files:
        filepath = os.path.join(recipes_dir, cf)
        try:
            cuisine_recipes = load_cuisine_module(filepath)
            for r in cuisine_recipes:
                r["id"] = recipe_id
                recipe_id += 1
                all_recipes.append(r)
            print(f"Loaded {len(cuisine_recipes)} recipes from {cf}")
        except Exception as e:
            print(f"Error loading {cf}: {e}")

    # Build metadata
    cuisines = sorted(set(r["origin"] for r in all_recipes))
    dietary_tags = sorted(set(tag for r in all_recipes for tag in r.get("dietary", [])))

    output = {
        "metadata": {
            "total_recipes": len(all_recipes),
            "cuisines": cuisines,
            "dietary_categories": dietary_tags,
            "schema_version": "1.0"
        },
        "recipes": all_recipes
    }

    output_path = os.path.join(os.path.dirname(__file__), "recipes.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\nGenerated {len(all_recipes)} recipes across {len(cuisines)} cuisines")
    print(f"Dietary categories: {len(dietary_tags)}")
    print(f"Output: {output_path}")

if __name__ == "__main__":
    main()
