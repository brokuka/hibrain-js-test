const form = document.getElementById("form");
const select = document.querySelector("select");
const board = document.querySelector(".board");
const heroInfo = document.querySelector(".hero_info");
const btnGroup = document.querySelector(".abilities");
const finish = document.querySelector(".finish");
const retryBtn = document.querySelector(".btn--retry");

const getMonsterDefense = document.querySelectorAll(
  ".monster_defense [data-defense]"
);

let monsterPhysicArmor = 0;
let monsterMagicArmor = 0;
let monsterPhysicalDmg = 0;
let monsterMagicDmg = 0;

let heroPhysicArmor = 0;
let heroMagicArmor = 0;
let heroPhysicDmg = 0;
let heroMagicDmg = 0;

let round = 1;
let bossMove = {};

const monster = {
  maxHealth: 10,
  name: "Лютый",
  moves: [
    {
      name: "Удар когтистой лапой",
      physicalDmg: 3, // физический урон 3
      magicDmg: 0, // магический урон
      physicArmorPercents: 20, // физическая броня
      magicArmorPercents: 20, // магическая броня
      cooldown: 0, // ходов на восстановление
    },
    {
      name: "Огненное дыхание",
      physicalDmg: 0,
      magicDmg: 4, //4
      physicArmorPercents: 0,
      magicArmorPercents: 0,
      cooldown: 3,
    },
    {
      name: "Удар хвостом",
      physicalDmg: 2, // 2
      magicDmg: 0,
      physicArmorPercents: 50,
      magicArmorPercents: 0,
      cooldown: 2,
    },
  ],
};

let monsterHp = monster.maxHealth;

const heroAbilities = [
  {
    name: "Удар боевым кадилом",
    physicalDmg: 2, // 2
    magicDmg: 0,
    physicArmorPercents: 0,
    magicArmorPercents: 50,
    cooldown: 0,
  },
  {
    name: "Вертушка левой пяткой",
    physicalDmg: 4, // 4
    magicDmg: 0,
    physicArmorPercents: 0,
    magicArmorPercents: 0,
    cooldown: 4,
  },
  {
    name: "Каноничный фаербол",
    physicalDmg: 0,
    magicDmg: 5, // 5
    physicArmorPercents: 0,
    magicArmorPercents: 0,
    cooldown: 3,
  },
  {
    name: "Магический блок",
    physicalDmg: 0,
    magicDmg: 0,
    physicArmorPercents: 100,
    magicArmorPercents: 100,
    cooldown: 4,
  },
];

let heroHp = 0;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (select.value) {
    startGame();
  }
});

function startGame() {
  form.classList.add("hide");
  board.classList.remove("hide");
  heroHp = select.value;

  createButtons();
  bossUsingAbility();
  createIndicators(round);
}

let heroBtnsWithCooldown = [];
let monsterAbilityWithCooldown = [];

function decreaseCooldown(type, button, cooldown) {
  const heroBtns = () => {
    if (cooldown > 0) {
      heroBtnsWithCooldown.push({ button, cooldown });
    }

    heroBtnsWithCooldown.map(({ button, cooldown }) => {
      let getBtnCooldown = button.getAttribute("data-cooldown");

      if (!button.hasAttribute("data-cooldown")) {
        button.setAttribute("data-cooldown", cooldown);
        button.disabled = true;
      } else {
        let mustRemove = getBtnCooldown - 1 === 0;

        if (mustRemove) {
          button.removeAttribute("data-cooldown");
          button.disabled = false;
          heroBtnsWithCooldown = heroBtnsWithCooldown.filter(
            (props) => props.button !== button
          );
        }

        !mustRemove &&
          button.setAttribute(
            "data-cooldown",
            cooldown > 0 ? getBtnCooldown - 1 : ""
          );
      }
    });
  };

  const monsterAbility = () => {
    monsterAbilityWithCooldown.map((obj) => {
      let mustRemove = obj.cooldown - 1 === 0;

      obj.cooldown--;

      monsterPhysicArmor = obj.physicArmorPercents;
      monsterMagicArmor = obj.magicArmorPercents;
      monsterPhysicalDmg = obj.physicalDmg;
      monsterMagicDmg = obj.magicDmg;

      if (mustRemove) {
        monsterAbilityWithCooldown = monsterAbilityWithCooldown.filter(
          (abil) => abil !== obj
        );
      }
    });

    let index = monsterAbilityWithCooldown.findIndex(
      (obj) => obj.name === button.name
    );

    if (index === -1) {
      if (button.cooldown > 0) {
        monsterAbilityWithCooldown.push(button);
      }
      console.log(
        `Способность: ${button.name}, физ.урон: ${button.physicalDmg}, маг.урон: ${button.magicDmg}, физ.броня: ${button.physicArmorPercents}, маг.защита: ${button.magicArmorPercents}`
      );
    }
  };

  switch (type) {
    case "hero":
      return heroBtns();
    case "monster":
      return monsterAbility();
    default:
      return;
  }
}

const createButtons = () => {
  const alreadyHasButton = document.querySelector(".btn--ability");
  if (alreadyHasButton) return;

  heroAbilities.map(
    (
      {
        name,
        physicalDmg,
        cooldown,
        magicDmg,
        magicArmorPercents,
        physicArmorPercents,
      },
      index
    ) => {
      const button = document.createElement("button");

      button.textContent = name;
      button.classList.add("btn", "btn--ability");
      button.dataset.ability = index;

      btnGroup.append(button);

      button.addEventListener("click", () => {
        heroMagicArmor = magicArmorPercents;
        heroPhysicArmor = physicArmorPercents;
        heroPhysicDmg = physicalDmg;
        heroMagicDmg = magicDmg;

        decreaseCooldown("hero", button, cooldown);
        bossUsingAbility();

        monsterHp = checkPersonDamage(
          monsterHp,
          heroPhysicDmg,
          heroMagicDmg,
          monsterPhysicArmor,
          monsterMagicArmor
        );

        heroHp = checkPersonDamage(
          heroHp,
          monsterPhysicalDmg,
          monsterMagicDmg,
          heroPhysicArmor,
          heroMagicArmor
        );

        createIndicators(
          ++round,
          [
            monsterHp,
            monsterPhysicalDmg,
            monsterMagicDmg,
            monsterPhysicArmor,
            monsterMagicArmor,
          ],
          [heroHp, heroPhysicDmg, heroMagicDmg, heroPhysicArmor, heroMagicArmor]
        );
      });
    }
  );
};

const checkPersonDamage = (
  hp,
  physicalDmg,
  magicDmg,
  physicArmorPercents,
  magicArmorPercents
) => {
  let hasMagicDmg = magicDmg > 0;
  let hasPhysicalDmg = physicalDmg > 0;
  let hasBothDmg = magicDmg && physicalDmg;

  const checkArmor = (
    physicArmor = physicArmorPercents,
    magicArmor = magicArmorPercents
  ) => {
    if (!physicArmorPercents && !magicArmorPercents) return "none";

    if (physicArmorPercents > 0 && magicArmorPercents > 0) return "both";

    if (!physicArmorPercents && magicArmorPercents) return "magic";

    if (!magicArmorPercents && physicArmorPercents) return "physic";
  };

  const getPercent = (armor, dmg) => {
    let getArmor = 100 - armor;

    return (hp -= (dmg * getArmor) / 100);
  };

  switch (checkArmor(physicArmorPercents, magicArmorPercents)) {
    case "none":
      return (hp -= physicalDmg || magicDmg);
    case "magic":
      if (hasMagicDmg) return getPercent(magicArmorPercents, magicDmg);

      return (hp -= physicalDmg);
    case "physic":
      if (hasPhysicalDmg) return getPercent(physicArmorPercents, physicalDmg);

      return (hp -= magicDmg);
    case "both":
      if (!hasMagicDmg && hasPhysicalDmg) {
        return getPercent(physicArmorPercents, physicalDmg);
      }

      return getPercent(magicArmorPercents, magicDmg);
    default:
      return hp;
  }
};

const bossUsingAbility = () => {
  let randomAbility = (obj = monster.moves) => {
    var keys = Object.keys(obj);

    return obj[keys[(keys.length * Math.random()) << 0]];
  };

  bossMove = { ...randomAbility() };
  decreaseCooldown("monster", bossMove);
};

const createIndicators = (round) => {
  let roundsInfo = document.querySelector(".rounds_info");
  let monsterHpInfo = document.querySelector(".monster_health");
  let getHeroDefense = heroInfo.querySelectorAll("[data-defense]");
  let heroHpInfo = heroInfo.querySelector(".hero_health");

  function refreshInfo(bool) {
    if (bool) return finishGame();

    monsterHpInfo.setAttribute("data-health", monsterHp);
    getMonsterDefense[0].setAttribute("data-defense", monsterPhysicArmor);
    getMonsterDefense[1].setAttribute("data-defense", monsterMagicArmor);

    roundsInfo = roundsInfo.textContent = `Раунд: ${round}`;

    heroHpInfo.setAttribute("data-health", heroHp);
    getHeroDefense[1].setAttribute("data-defense", heroPhysicArmor);
    getHeroDefense[0].setAttribute("data-defense", heroMagicArmor);

    return { roundsInfo };
  }

  if (roundsInfo) {
    return refreshInfo(monsterHp <= 0 || heroHp <= 0 ? true : false);
  }

  const roundInfoH3 = document.createElement("h3");
  roundInfoH3.textContent = `Раунд: ${round}`;
  roundInfoH3.classList.add("rounds_info");

  monsterHpInfo.setAttribute("data-health", monsterHp);
  heroHpInfo.setAttribute("data-health", heroHp);

  board.append(roundInfoH3);
};

function finishGame() {
  bossMove = {};
  heroBtnsWithCooldown = [];
  monsterHp = monster.maxHealth;
  heroHp = select.value;
  round = 1;
  board.classList.add("hide");
  finish.classList.remove("hide");

  retryBtn.addEventListener("click", resetGame);
}

function resetGame() {
  let getCooldownBtns = heroInfo.querySelectorAll("[data-cooldown]");

  finish.classList.add("hide");
  form.classList.remove("hide");

  getCooldownBtns.forEach((btn) => {
    btn.removeAttribute("data-cooldown");
    btn.disabled = false;
  });

  console.clear();
}
