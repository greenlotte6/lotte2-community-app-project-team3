package kr.co.workie.service;

import kr.co.workie.dto.PageDTO;
import kr.co.workie.entity.Page;
import kr.co.workie.repository.PageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class PageService {

    private final ModelMapper modelMapper;
    private final PageRepository pageRepository;

    public int addPage(String loginId, PageDTO pageDTO) {
        Page page = modelMapper.map(pageDTO, Page.class);
        page.setWriter(loginId);

        Page savedPage = pageRepository.save(page);

        return savedPage.getPno();
    }

    public void addMember(){}

    public void modifyPage(){}

    public void deletePage(){}

    public List<Page> getPageByWriter(String loginId) {
        List<Page> pageList = pageRepository.findAllByWriter(loginId);
        return pageList.stream()
                .map(page -> modelMapper.map(page, Page.class))
                .collect(Collectors.toList());
    }

    public int addFavorite(int pno, boolean favorite) {
        Page page = pageRepository.findById(pno).orElseThrow();
        page.setFavorite(favorite);
        pageRepository.save(page);
        return pno;
    }
}
