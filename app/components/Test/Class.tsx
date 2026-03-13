interface TestClass {
  name: string;
};

class TestClass {
  constructor(name: string) {
    console.log('test class');
    this.name = name;
  }

  testFunc() {
    console.log('test func');
  }
}

export default TestClass;