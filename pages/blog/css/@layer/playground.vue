<template>
  <div class="container"></div>
</template>

<style scoped>
@layer container2;

.container {
  width: 200px;
  height: 200px;
}

/* @layer container2, container1; */

@layer container1 {
  .container {
    background-color: blue;
  }
}

@layer container2 {
  .container {
    background-color: green;
  }
}

@layer parent {
  .container {
    background-color: yellow;
  }

  @layer child {
    .container {
      background-color: red;
    }
  }
}

@layer parent2, parent1;

@layer parent1 {
  .container {
    background-color: blanchedalmond;
  }

  @layer child1 {
    .container {
      background-color: brown;
    }
  }
}

@layer parent2 {
  .container {
    background-color: darkcyan;
  }

  @layer child2 {
    .container {
      background-color: slateblue;
    }
  }
}
</style>
