---
title: 面向对象编程七大原则
date: 2023-03-07
tags:
  - js
  - oop
---

# 面向对象编程七大原则

## 七大原则

- 开闭原则
- 依赖倒转原则
- 里氏替换原则
- 单一职责原则
- 接口隔离原则
- 合成复用原则
- 迪米特法则

### 开闭原则

> 开闭原则是面向对象设计中的一个重要原则，它指导我们如何编写可维护和可扩展的代码。简单来说，开闭原则的含义是：软件实体（类、模块、函数等）应该可以被扩展，同时不会影响到已有的代码（即对修改关闭，对扩展开放）。

在实际编写代码的过程中，我们可以通过使用抽象层、接口、多态等技术来实现开闭原则。例如，我们可以定义一个抽象的基类或接口，然后让具体的实现类来继承或实现这个抽象类或接口，这样在需要扩展新功能时，只需要新增一个继承或实现类即可，而不需要改动已有代码。

开闭原则能够提高代码的扩展性和重用性，并且能够减少因修改代码而引入的错误，从而更加方便维护代码。

下面是一个简单的例子，我们定义了一个 User 类，它有一个 greet()方法用于打招呼，然后我们又创建了一个 VIPUser 类来扩展 User 类，VIP 用户不仅可以打招呼，还能获得礼物，我们并没有直接修改 User 类的代码，而是通过扩展的方式实现了这个新功能。

```js
// User 类
class User {
  constructor(name) {
    this.name = name;
  }

  greet() {
    console.log(`Hi, my name is ${this.name}`);
  }
}

// VIPUser 类，继承于 User
class VIPUser extends User {
  constructor(name, points) {
    super(name);
    this.points = points;
  }

  // 给 VIP 用户添加新的功能
  getGift() {
    console.log("Congratulations! You have received a gift.");
  }
}

// 创建一个普通用户
const john = new User("John");
john.greet(); // Hi, my name is John

// 创建一个 VIP 用户
const alice = new VIPUser("Alice", 100);
alice.greet(); // Hi, my name is Alice
alice.getGift(); // Congratulations! You have received a gift.
```

在这个例子中，我们扩展了 User 类，使它成为了 VIPUser 类，并新增了一个 getGift()方法，这个方法只属于 VIP 用户，而普通用户没有这一功能。同时，User 类并没有被直接修改，因此它依然符合开闭原则。

### 依赖倒转原则

> 依赖倒转原则是 SOLID 原则中的一项，它倡导面向接口编程，而不是面向实现编程。简单来说，高层模块不应该依赖于低层模块，二者都应该依赖于抽象；抽象不应该依赖于细节，细节应该依赖于抽象。

在 JavaScript 中，我们可以使用接口来实现依赖倒转原则。例如，我们定义一个接口：

```js
interface DatabaseConnector {
  connect(): void;
  query(query: string): ResultSet;
}
```

然后，我们创建几个类，分别实现这个接口：

```js
class MySQLConnector implements DatabaseConnector {
  connect() {
    /* 连接 MySQL 数据库 */
  }
  query(query) {
    return; /* 执行 MySQL 查询 */
  }
}

class PostgreSQLConnector implements DatabaseConnector {
  connect() {
    /* 连接 PostgreSQL 数据库 */
  }
  query(query) {
    return; /* 执行 PostgreSQL 查询 */
  }
}
```

现在，我们可以使用这个接口来降低模块之间的耦合度。例如，我们创建一个服务类，需要连接数据库进行查询：

```js
class ProductService {
  constructor(private dbConnector: DatabaseConnector) {}

  findProduct(id: number) {
    this.dbConnector.connect();
    const result = this.dbConnector.query(`SELECT * FROM products WHERE id = ${id}`);
    // 处理查询结果并返回
  }
}
```

这个服务类不关心底层使用的是什么具体数据库，只要传入实现了 DatabaseConnector 接口的对象即可。这样，我们就实现了开闭原则和依赖倒转原则。

#### 优点

依赖倒转原则是 SOLID 设计原则中的一个，旨在减少组件之间的耦合性。该原则主要解决的问题是当高层模块依赖于底层模块时，修改底层模块可能会导致高层模块出现意外行为，因此需要通过接口抽象等方式将高母都与底层模块分离。

这样的好处包括：

- 降低耦合性：使用接口进行依赖管理，可以避免各个层次之间出现藕断丝连的问题，从而提高代码的灵活性和可维护性。
- 提高灵活性：通过接口隔离，高层模块只依赖于抽象而不依赖于具体实现，方便替换具体的实现，从而达到系统整体的扩展和灵活性。
- 更容易测试：通过接口隔离，可以更方便地对每个单元进行单独测试，减少了缺陷的可能性，同时也简化了测试用例。

因为高级组件只是依赖于底层组件的抽象接口或类，而不是直接依赖于底层组件的具体实现细节，所以当需要更改某个底层组件时，只需要按照相应的接口规范来替换底层组件的实现方式，高级组件的表现不会受到影响。由于高级组件与底层组件之间只有松散的依赖关系，所以底层组件的变化不会对高级组件造成任何不良影响。这就是依赖倒转原则的优秀之处，能够保证软件系统在面对新的或者变化的需求时，不会对原有的系统产生任何负面影响。

### 里氏替换原则

> 里氏替换原则，简称 LSP（Liskov Substitution Principle），是面向对象编程中的一个重要原则，由 Barbara Liskov 在 1987 年于一份论文中提出。这个原则规定：『子类可以扩展父类的功能，但不能改变父类原有的功能』。

具体来说，子类可以实现父类的抽象方法，或者通过继承父类来调用父类的方法，但是不能修改父类的原有方法。

```js
class Shape {
  area() {}
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }

  area() {
    return this.width * this.height;
  }
}

class Square extends Shape {
  constructor(side) {
    super();
    this.side = side;
  }

  area() {
    return Math.pow(this.side, 2);
  }
}

function calculateArea(shape) {
  return shape.area();
}

const rectangle = new Rectangle(4, 5);
const square = new Square(5);

console.log(calculateArea(rectangle)); // output: 20
console.log(calculateArea(square)); // output: 25
```

在上面的代码中，我们定义了一个 Shape 类，它具有一个 area()方法，其返回值为 0。然后我们定义了两个子类——Rectangle 和 Square，它们都重写了 area()方法来计算自己的面积。最后，我们定义了一个 calculateArea()函数，该函数接受一个 Shape 类型的参数并调用它的 area()方法来计算面积。

通过这种方式，我们可以在不违反 LSP 原则的情况下使用这些类，因为子类不仅仅扩展了父类的功能，而且还保留了父类的核心行为即 area()方法，因此我们可以将子类当做父类类型进行操作。

### 单一职责原则

> 单一职责原则（Single Responsibility Principle，SRP）是指一个类或者模块应该都有且只有一个职责（Responsibility），即每个类或模块都应该只负责完成一个功能或任务。

这个原则强调的是职责的单一性，也就是一个类必须专注于做一件事情，而不是将多种不同的职责混在一起。如果将不同职责混合到一个类中，则当某种职责发生变化时，可能会影响到其它职责的实现，导致代码出现风险并难以修改和维护。

例如，在一个系统中，有一个类负责读取文件，并将数据解析成对象返回给客户端。如果这个类同时又兼具缓存管理的职责，那么当需要修改缓存策略时，可能会影响到文件读取和解析等功能的正常运行。因此，将读取文件和缓存管理分开到不同的类中，可以提高代码的可维护性和可扩展性。

总之，遵循单一职责原则可以让代码更加清晰、简洁、易于理解和维护。

### 接口隔离原则

> 接口隔离原则（Interface Segregation Principle，ISP）是指使用多个专门的接口，而不是使用单一的总接口。它体现了一个设计原则：一个类对另一个类的依赖应该建立在最小的接口上。

ISP 的核心思想是：不应该强迫客户依赖于它们不用的方法。即只有实现类需要用到的方法才在接口中声明，而不必像单一接口原则要求那样去强制实现所有方法。这可以避免一些问题，比如代码冗余、解耦性差等等。

下面是一个简单的 JavaScript 例子来说明接口隔离原则：

```js
// 不遵守 ISP 的写法
class Animal {
  getName() {}
  fly() {}
  swim() {}
}

// 实现时必须实现无用方法
class Bird extends Animal {
  getName() {}
  fly() {}
  swim() {
    throw new Error("Bird cannot swim");
  }
}

// 遵守 ISP 的写法
interface Animal {
  getName(): string;
}

interface Flyable {
  fly(): void;
}

interface Swimable {
  swim(): void;
}

// 只需实现必要方法
class Bird implements Animal, Flyable {
  getName() {
    return "Bird";
  }

  fly() {}
}
```

如果采用 ISP 原则，就不需要实现 Bird 类中无用的 swim() 方法，也就不会抛出 Bird cannot swim 的错误。这种原则通常可以帮助程序员避免出现不必要的麻烦，增加代码可读性和可维护性。

### 合成复用原则

> 合成复用原则（Composite Reuse Principle，CRP）是指在软件复用时，尽量使用组合或者聚合关系，而不是继承关系，使系统更加灵活，降低类与类之间的耦合度，同时也有利于提高软件系统的维护性和扩展性。

从实现角度来看，可以采用多个较小的对象组成一个大的对象，以达到复用的目的。这种做法称为“对象组合”，如果一个类通过继承实现代码复用，则称为“类继承”。

使用合成复用原则可以使系统更加灵活、高效，同时能够降低系统的维护成本。在实际开发中应该尽可能地使用组合/聚合，而避免使用类继承，只有当确实需要使用类继承时，才应该使用。由于继承关系破坏了封装性，增加了代码的侵入性，这样会导致程序的扩展性变得非常差。而使用组合/聚合关系可以达到目标，不仅具备了继承重用的优点，还保持了良好的封装性和模块独立性，同时也不会带来过多的侵入性，对程序的扩展性并不会造成影响。

下面是一个使用组合实现的示例：

```js
class Car {
  constructor(engine, body) {
    this.engine = engine;
    this.body = body;
  }

  run() {
    console.log(`The car is running with ${this.engine} and ${this.body}`);
  }
}

class Engine {
  constructor(type) {
    this.type = type;
  }

  start() {
    console.log(`The ${this.type} engine is starting`);
  }
}

class Body {
  constructor(color) {
    this.color = color;
  }

  paint() {
    console.log(`Paint the body to ${this.color}`);
  }
}

// 组合使用Engine和Body
const engine = new Engine("gasoline");
const body = new Body("black");
const car = new Car(engine, body);

car.run(); // 输出：The car is running with gasoline and black
```

在上面的示例中，Car 类通过组合 Engine 和 Body 类，实现了汽车的制作。这样做的好处是，当需要修改引擎和车身时，可以轻松地创建一个新的引擎类和车身类，不会影响到 Car 类的运行。

### 迪米特法则

> 迪米特法则（Law of Demeter），又称为最少知识原则（Least Knowledge Principle），是一种面向对象设计的法则。其核心思想是：一个对象应该对其他对象有尽可能少的了解。简言之，一个类不应该了解他所依赖的类的内部细节。

根据迪米特法则，一个对象应当对其他对象有限的接触，它只与那些直接和它相关的对象通信，而与其他对象则保持距离。这个法则可以很好地隔离系统中的各个部分，从而实现多层次、松耦合的架构。

具体来说，按照迪米特法则，一个对象在被调用时，将会出现以下三种关系：

- 该对象本身
- 其他作为参数传入的对象
- 该对象里面及其实例化的对象

而访问其它与当前并无特别联系的类中的数据或方法，就被视为违反最少知道原则。

总结起来，迪米特法则就是要求在设计系统时，尽可能减少对象间的耦合性，使得系统更加灵活、易于维护和扩展。

以下是一个使用 JavaScript 实现迪米特法则的示例代码：

```js
class Course {
  constructor(name, teacher) {
    this.name = name;
    this.teacher = teacher;
    this.students = [];
  }

  addStudent(student) {
    this.students.push(student);
  }
}

class Teacher {
  constructor(name, courses) {
    this.name = name;
    this.courses = courses;
  }

  getCourses() {
    return this.courses.map((course) => course.name);
  }
}

class Student {
  constructor(name) {
    this.name = name;
    this.courses = [];
  }

  enroll(course) {
    course.addStudent(this);
    this.courses.push(course);
  }

  getTeachers() {
    return this.courses.map((course) => course.teacher.name);
  }
}

const mathCourse = new Course("Math", new Teacher("John Doe", [mathCourse]));
const alice = new Student("Alice");
alice.enroll(mathCourse);

console.log(alice.getTeachers()); // ["John Doe"]
```

上述代码定义了三个类：Course、Teacher 和 Student。这三个类分别代表了课程、教师和学生。其中，Course 类拥有一个学生列表，并且可以添加学生；Teacher 类拥有多个课程，并且可以返回自己所授课程的名称列表；Student 类拥有多个课程，并且可以将自己添加到课程的学生列表中，同时可以返回自己所选课程的教师名称列表。

在这个示例代码中，各个类之间都只依赖于彼此的接口（即公开的方法和属性），而不依赖于彼此的实现细节。比如，在学生的 enroll 方法中，并不需要了解课程类和教师类的内部实现，只需要调用它们对外公开的添加学生和获取教师名称的方法即可。这样一来，各个类之间的耦合度就被降低了，使得系统更加灵活和易于维护。

### 差异

1. 感觉开闭原则、依赖倒转原则、里氏替换原则本质上都差不多嘛，都是抽象类或者公共方法变量，让继承类去实现

虽然这些原则都涉及到抽象类和继承，但它们针对的问题和解决方案不尽相同。下面是我对每个原则的解释和目的：

- 开闭原则（OCP）：该原则指出，在不修改现有代码的情况下扩展应用程序的开放性和封闭性。换句话说，一个模块、类或方法应该对扩展开放，对修改关闭。这意味着我们应该编写灵活的代码，以便可以添加新的功能或更改现有功能，并且不会破坏代码中其他部分的行为。这并不一定涉及到抽象类或者公共方法变量，而是强调在开发过程中考虑未来可能的需求变化。
- 依赖倒转原则（DIP）：该原则旨在减少高级组件与底层组件之间的直接依赖关系。具体而言，它要求高级组件依赖于抽象（接口），而不是依赖于底层具体实现。这样做的好处是，当需要更改某个底层组件时，不会影响到高级组件的表现，因为只需要替换底层实现即可。因此，这个原则与 OCP 有关系，两个原则都注重灵活性和可维护性。
- 里氏替换原则（LSP）：该原则涉及到继承关系。其基本思想是，派生类必须能够完全替代其基类。换句话说，类型 A 的对象可以被类型 B 的对象替换，而不会破坏程序的正确性。如果一个子类不能替代其父类，那么可能说明设计有缺陷。通过遵循 LSP，我们可以得到支持多态和代码重用的优雅、灵活的代码。

综上所述，这三个原则目的不尽相同，虽然使用了相似的机制，即抽象类和继承。开闭原则和依赖倒转原则都注重应对需求变化，而里氏替换原则注重面向对象设计的基础，如多态和继承。
