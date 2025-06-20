package kr.co.workie.service;

import kr.co.workie.dto.BoardDTO;
import kr.co.workie.dto.PageDTO;
import kr.co.workie.entity.Board;
import kr.co.workie.entity.User;
import kr.co.workie.repository.BoardRepository;
import kr.co.workie.security.MyUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class BoardService {
    private final ModelMapper modelMapper;
    private final BoardRepository boardRepository;

    public int addArticle(String loginId, BoardDTO boardDTO) {
        Board board = modelMapper.map(boardDTO, Board.class);
        board.setWriter(loginId);

        Board savedBoard = boardRepository.save(board);

        log.info("Saved Board : {}", savedBoard);

        return savedBoard.getAno();
    }

    public List<BoardDTO> getBoardsByCategory(String category) {
        List<Board> boardList = boardRepository.findByCategory(category);
        return boardList.stream()
                .map(board -> modelMapper.map(board, BoardDTO.class))
                .collect(Collectors.toList());
    }

}