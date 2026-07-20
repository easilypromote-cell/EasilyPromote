const COST_PER_VIEW = {
  default: 1.085,
  categories: {
    Music: 1.085,
    Fashion: 1.2,
    Tech: 1.15,
    Food: 1.1,
    Travel: 1.25,
    Fitness: 1.15,
    Beauty: 1.2,
    Gaming: 1.1,
  },
};

function getCostPerView(category) {
  if (category && COST_PER_VIEW.categories[category]) {
    return COST_PER_VIEW.categories[category];
  }
  return COST_PER_VIEW.default;
}

module.exports = { getCostPerView, COST_PER_VIEW };
