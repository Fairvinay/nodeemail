import java.util.ArrayList;
import java.util.*;
import java.util.stream.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.ConcurrentMap;

public class MyClass {
    public static void main(String args[]) {
      int x=10;
      int y=25;
      int z=x+y;

      System.out.println("Sum of x+y = " + z);
      
      IntStream ls = Arrays.stream(new int[] {10,15,1,23,42});
      IntStream ls1 = Arrays.stream(new int[] {10,15,1,23,42});
      StringBuffer st = new StringBuffer();
	  //int len = ls.length();
	   AtomicInteger index = new AtomicInteger();
	   final String prefix = "";
	   final String del = "-";
	   // .peek(item -> counter.incrementAndGet()) 
       //ls1.forEach( str -> {
	   //.map(str -> { index.getAndIncrement();
		//				st.append(prefix+str+"");
		//				prefix = del; });
	   // mapToObj(u -> (u)+""))
	   // ls1.collect(StringBuilder::new,            // supplier
       //                         StringBuilder::appendCodePoint, // accumulator
       //                         StringBuilder::append).toString
	   char[] charArr = new char[100]; //.mapToObj(idx -> charArr[idx])
	   System.out.println(" st  "+String.join(del , ls1.mapToObj(c ->  Integer.toString(c)+"").collect(Collectors.toList())));
	   
	   /* Google Guava collections 
	   Streams.mapWithIndex(
			Stream.of("a", "b", "c"),
			(str, index) -> str + ":" + index)
		); 
		*/ // will return Stream.of("a:0", "b:1", "c:2")
		
		 List<String> strings = new LinkedList<>();
        strings.add("a");
        strings.add("B");
        strings.add("ab");
        strings.add("abc");
        strings.add("ABC");

        ConcurrentMap<Integer, List<String>> byLength = strings
                .parallelStream().collect(
                        Collectors.groupingByConcurrent(String::length));
		System.out.println(byLength);
		
		
		
		  List<Person> persons =
        Arrays.asList(
            new Person("Max", 18),
            new Person("Peter", 23),
            new Person("Pamela", 23),
            new Person("David", 12));   
		
		 Integer ageSum = persons
        .stream()
        .reduce(0,
            (sum, p) -> {
                System.out.format("accumulator: sum=%s; person=%s\n", sum, p);
                return sum += p.age;
            },
            (sum1, sum2) -> {
                System.out.format("combiner: sum1=%s; sum2=%s\n", sum1, sum2);
                return sum1 + sum2;
            });

    System.out.println(ageSum);
	   
      List<String> myStringNum  =ls.mapToObj(i ->  Integer.toString(i)+"").collect(Collectors.toList());
      
      System.out.println("print list length "+myStringNum.size());
      System.out.println("print list length "+myStringNum.get(0));
     /* myStringNum.forEach((g) -> { 
           System.out.println(g);
                   if(g.startsWith("1")){
                       System.out.println(g);
                   }
      });
      */
    }
}

class Person {
  String name;
  int age;

  Person(String name, int age) {
      this.name = name;
      this.age = age;
  }

  @Override
  public String toString() {
      return name;
  }
}