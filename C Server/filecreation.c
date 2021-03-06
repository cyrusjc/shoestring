/*f
unction	purpose
fopen ()	            Creating a file or opening an existing file
fclose ()	            Closing a file
fprintf ()	            Writing a block of data to a file
fscanf ()	            Reading a block data from a file
getc ()	                Reads a single character from a file
putc ()	                Writes a single character to a file
getw ()	                Reads an integer from a file
putw ()	                Writing an integer to a file
fseek ()	            Sets the position of a file pointer to a specified location
ftell ()            	Returns the current position of a file pointer
rewind ()           	Sets the file pointer at the beginning of a file
*/

#include <stdlib.h>
#include <stdio.h>

int main(){
    FILE *fp;
    fp = fopen ("data.txt", "a+");
    
    fputs ("swaglord",fp);
    
    fclose(fp);
    return 0;
}