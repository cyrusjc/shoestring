// Server side C program to demonstrate Socket programming
#include <stdio.h>
#include <sys/socket.h>
#include <unistd.h>
#include <stdlib.h>
#include <netinet/in.h>
#include <string.h>

#include <pthread.h>        // for multithreading

#include <dirent.h>

#define PORT 4000
#define BACKLOG 10

int createSocket(){
    int server_fd;
    if ((server_fd = socket(AF_INET, SOCK_STREAM, 0)) <= 0)
    {
        perror("In socket");
        exit(EXIT_FAILURE);
    }
    return server_fd;
}

void bindSocket(int socket,struct sockaddr_in address){
    
    
    if (bind(socket, (struct sockaddr *)&address, sizeof(address))<0)
    {
        perror("In bind");
        exit(EXIT_FAILURE);
    }
    
}

void listFiles(int socket){
    DIR *d;
    struct dirent *dir;
    d = opendir(".");
    if (d)
    {   
        char msg[1000] = "The following files are on the directory:\n";
        while ((dir = readdir(d)) != NULL)
        {
            
            strcat(msg, dir->d_name);
            strcat(msg, " ");
        }
        
        printf("%s\n", msg);
        send(socket , &msg , strlen(msg),0);
        closedir(d);
    } 
    return;
}

void * handler(void *p_socket){
    
        int socket = *((int*)p_socket);
        long valread;
        int cont = 1;
        
        char buffer[30000] = {0};
        char *hello = "What would you like to do?\n 1. List\n 0. Terminate";
        send(socket , hello , strlen(hello), 0);
        
        while(cont){
            recv( socket , buffer, 30000, 0);
            printf("recieved: %s\n",buffer );
            switch(buffer[0])
            {
                case '1': 
                    printf("1\n");
                    //send(socket, "Sending Files", strlen("Sending Files"), 0);
                    listFiles(socket);
                    break;
                case '0':
                    printf("Terminating socket\n");
                    cont = 0;
                    break;
                default:
                    printf("Error wrong socket\n");
                    send(socket, "Please enter another number from", 32,0 );
                    break;
            }
            buffer[0] = '\0';
        }
        

        free(p_socket);
        close(socket);
        return NULL;
}

int main()
{
 
    // Creating socket file descriptor
    // STEP 1, CREATING SOCKET
    int server_fd = createSocket();
    // STEP 2, BINDING THE SOCKET
    // declare struct sockaddr_in and fill
    struct sockaddr_in address;
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons( PORT );
    bindSocket(server_fd, address);
    

    if (listen(server_fd, BACKLOG) < 0)
    {
        perror("In listen");
        exit(EXIT_FAILURE);
    }
    
    int addrlen = sizeof(address);
    int new_socket; 
    
    while(1)
    {
        printf("\n+++++++ Waiting for new connection ++++++++\n");
        if ((new_socket = accept(server_fd, (struct sockaddr *)&address, (socklen_t*)&addrlen))<0)
        {
            perror("In accept");
            exit(EXIT_FAILURE);
        }
        puts("Connected\n");
        
        
        pthread_t thread;
        int *p_new_socket = malloc(sizeof(int));
        *p_new_socket = new_socket;
        pthread_create(&thread, NULL, handler, p_new_socket);
        //handler(&new_socket);

    }
    
    return 0;
}

